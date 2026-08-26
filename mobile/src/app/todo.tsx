import Service from "@/components/services/Service";
import TodoDay from "@/components/services/todo/TodoDay";
import { setDays } from "@/components/services/todo/todoSlice";
import { Day } from "@/components/services/todo/types.mobile";
import {
  isItems,
  Item,
  OnlyDate,
} from "@/components/services/todo/types.server";
import { intersects } from "@/components/services/todo/util.server";
import { todoService } from "@/components/services/types";
import { day, loadLength, loadLengthLong } from "@/constants/services/todo";
import useServer from "@/hooks/useServer";
import { useAppDispatch, useAppSelector } from "@/store";
import { checkResponse } from "@/util.mobile";
import { useEffect, useRef } from "react";
import { FlatList, StyleSheet } from "react-native";

export default function Todo() {
  console.log("render");

  const days = useAppSelector((state) => state.todo.days);
  const daysRef = useRef(days);
  daysRef.current = days;

  const dispatch = useAppDispatch();

  const { ip, port } = useServer();
  useEffect(() => {
    dispatch(setDays([]));
  }, [ip, port]);

  const loadNext = async (long: boolean) => {
    const lastDay = days.at(-1);
    const dateObject = lastDay
      ? new Date(lastDay.date[0], lastDay.date[1] - 1, lastDay.date[2])
      : new Date();
    const dates: OnlyDate[] = [];
    for (let i = 0; i < (long ? loadLengthLong : loadLength); i++) {
      dateObject.setTime(dateObject.getTime() - day);
      const date: OnlyDate = [
        dateObject.getFullYear(),
        dateObject.getMonth() + 1,
        dateObject.getDate(),
      ];
      dates.push(date);
    }
    dispatch(
      setDays([
        ...days,
        ...dates.map((date) => ({ date, items: [], loaded: false })),
      ]),
    );
  };

  useEffect(() => {
    if (days.length) return;
    loadNext(true);
  }, [days, loadNext]);

  useEffect(() => {
    const daySegment: Day[] = [];
    const fetchDays = async (days: Day[]) => {
      // reverse chronological order
      // last in the list is earliest
      // first in the list is latest
      const start = days[days.length - 1].date;
      const end = days[0].date;
      try {
        const resp = await fetch(
          `http://${ip}:${port}/todo/items/get/${start.join("/")}/${end.join("/")}`,
        );
        const data = await checkResponse(resp);
        if (!isItems(data)) throw new Error("Invalid values");
        const items = data;
        const itemsPerDay: Item[][] = [];
        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          itemsPerDay.push([]);
          for (const item of items)
            if (intersects(item, day.date)) itemsPerDay[i].push(item);
        }
        dispatch(
          setDays(
            daysRef.current.map((d) => {
              for (let i = 0; i < days.length; i++) {
                const day = days[i];
                if (
                  d.date[0] === day.date[0] &&
                  d.date[1] === day.date[1] &&
                  d.date[2] === day.date[2]
                )
                  return { ...d, items: itemsPerDay[i], loaded: true };
              }
              return d;
            }),
          ),
        );
      } catch (e) {
        console.error(e);
      }
    };
    for (const day of days) {
      if (day.loaded) {
        if (daySegment.length) fetchDays(daySegment);
        daySegment.splice(0, daySegment.length);
        continue;
      }
      daySegment.push(day);
    }
    if (daySegment.length) fetchDays(daySegment);
  }, [days]);

  return (
    <Service service={todoService}>
      <FlatList
        style={[styles.list]}
        data={days}
        renderItem={({ item }) => <TodoDay day={item} />}
        onEndReached={() => loadNext(false)}
        onEndReachedThreshold={0.5}
      />
    </Service>
  );
}

const styles = StyleSheet.create({
  list: {},
});
