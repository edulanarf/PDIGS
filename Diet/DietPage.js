import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { auth, db } from "../db/firebase";
import { doc, getDoc } from "firebase/firestore";

const BLUE = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";

/* ---------------- HELPERS ---------------- */

const formatDateId = (date) => date.toISOString().split("T")[0];

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  const start = new Date(d);
  start.setDate(diff);
  return start;
};

const buildWeek = (startDate) => {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    days.push({
      id: formatDateId(d),
      label: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  return days;
};

/* ---------------- MAIN ---------------- */

export function DietPage({ route }) {
  const { dietId } = route.params;

  const [diet, setDiet] = useState(null);
  const [daysData, setDaysData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekStart, setWeekStart] = useState(null);

  /* -------- LOAD DIET -------- */
  useEffect(() => {
    const loadDiet = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid || !dietId) return;

      const ref = doc(db, `users/${uid}/dietas/${dietId}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data();
      setDiet(data);

      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date();

      setWeekStart(getWeekStart(createdAt));
    };

    loadDiet();
  }, [dietId]);

  /* -------- BUILD WEEK -------- */
  const week = useMemo(() => {
    if (!weekStart) return [];
    return buildWeek(weekStart);
  }, [weekStart]);

  /* -------- SELECT TODAY AUTO -------- */
  useEffect(() => {
    if (!week.length) return;

    const todayId = new Date().toISOString().split("T")[0];

    const exists = week.find(d => d.id === todayId);

    if (exists) setSelectedDay(todayId);
    else setSelectedDay(week[0].id);
  }, [week]);

  /* -------- LOAD DAYS -------- */
  useEffect(() => {
    const loadWeek = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid || !dietId || !weekStart) return;

      const result = {};

      for (let day of week) {
        const ref = doc(
          db,
          `users/${uid}/dietas/${dietId}/dias/${day.id}`
        );

        const snap = await getDoc(ref);

        result[day.id] = snap.exists()
          ? snap.data()
          : {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              meals: {},
            };
      }

      setDaysData(result);
    };

    loadWeek();
  }, [weekStart, dietId]);

  /* -------- ACTIVE DAY -------- */
  const activeDayId = selectedDay ?? week[0]?.id;

  const day = daysData[activeDayId] || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  /* -------- GOALS -------- */
  const caloriesGoal = diet?.calorias || 0;
  const proteinGoal = diet?.proteinas || 0;
  const carbsGoal = diet?.carbohidratos || 0;
  const fatGoal = diet?.grasas || 0;

  const fill = caloriesGoal ? (day.calories / caloriesGoal) * 100 : 0;

  /* -------- MONTH LABEL -------- */
  const monthLabel = useMemo(() => {
    if (!week.length) return "";

    const firstDay = new Date(week[0].id);

    return firstDay.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [week]);

  /* -------- WEEK NAV -------- */
  const changeWeek = (dir) => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  return (
    <ScrollView style={styles.container}>

      {/* MONTH */}
      <Text style={styles.month}>{monthLabel}</Text>

      {/* WEEK */}
      <View style={styles.weekBar}>
        <TouchableOpacity onPress={() => changeWeek(-1)}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>

        {week.map((d) => (
          <TouchableOpacity
            key={d.id}
            onPress={() => setSelectedDay(d.id)}
            style={[
              styles.day,
              selectedDay === d.id && styles.dayActive,
            ]}
          >
            <Text style={styles.weekday}>{d.weekday[0]}</Text>
            <Text style={styles.dayNum}>{d.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => changeWeek(1)}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* CALORIES */}
      <View style={styles.calories}>
        <AnimatedCircularProgress
          size={220}
          width={18}
          fill={fill}
          tintColor={BLUE}
          backgroundColor={BLUE_LIGHT}
          rotation={-90}
          arcSweepAngle={180}
        >
          {() => (
            <Text style={styles.calText}>
              {day.calories} / {caloriesGoal} kcal
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* MACROS */}
      <View style={styles.macros}>
        <Macro label="Protein" value={day.protein} goal={proteinGoal} color="#f97316" />
        <Macro label="Carbs" value={day.carbs} goal={carbsGoal} color="#22c55e" />
        <Macro label="Fat" value={day.fat} goal={fatGoal} color="#a855f7" />
      </View>

      {/* MEALS */}
      <Meal title="Breakfast" />
      <Meal title="Snack" />
      <Meal title="Lunch" />
      <Meal title="Dinner" />

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

/* ---------------- MACRO ---------------- */

function Macro({ label, value, goal, color }) {
  const pct = goal ? (value / goal) * 100 : 0;

  return (
    <View style={styles.macroBox}>
      <Text style={[styles.macroLabel, { color }]}>{label}</Text>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>

      <Text style={styles.macroText}>
        {value} / {goal}
      </Text>
    </View>
  );
}

/* ---------------- MEAL ---------------- */

function Meal({ title, onAdd, data = {} }) {
  return (
    <View style={styles.mealCard}>

      {/* HEADER */}
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>

        {/* 🔥 MINI STATS TOP RIGHT */}
        <View style={styles.mealStats}>
          <Text style={styles.mealStatText}>{data.calories || 0} Kcal</Text>
          <Text style={styles.mealStatText}>{data.protein || 0} P</Text>
          <Text style={styles.mealStatText}>{data.carbs || 0} C</Text>
          <Text style={styles.mealStatText}>{data.fat || 0} F</Text>
        </View>
      </View>

      {/* CONTENT */}
      <Text style={styles.emptyText}>
        No meals added yet
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Text style={styles.addButtonText}>+ Add food</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  month: {
    fontSize: 18,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 10,
  },

  weekBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },

  arrow: { fontSize: 22, fontWeight: "bold" },

  day: { alignItems: "center", padding: 6 },

  dayActive: {
    backgroundColor: BLUE_LIGHT,
    borderRadius: 8,
  },

  weekday: { fontSize: 10, color: "#666" },
  dayNum: { fontSize: 14, fontWeight: "700" },

  calories: { alignItems: "center", marginTop: 20 },

  calText: { fontSize: 16, fontWeight: "700", color: BLUE },

  macros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  macroBox: { width: "30%",marginTop: -70, marginBottom:70 },

  macroLabel: { fontSize: 12, fontWeight: "700" },

  barBg: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 4,
  },

  barFill: { height: "100%" },

  macroText: { fontSize: 11, color: "#444" },

  meal: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  mealTitle: { fontWeight: "700" },

  empty: { marginTop: 8, color: "#999" },

  addBtn: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  mealCard: {
  backgroundColor: "#F8FAFC",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 2,
},

mealHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

mealTitle: {
  fontSize: 15,
  fontWeight: "700",
  color: "#185FA5",
},

mealBadge: {
  backgroundColor: "#E6F1FB",
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 20,
},

mealBadgeText: {
  fontSize: 11,
  fontWeight: "600",
  color: "#185FA5",
},

emptyText: {
  color: "#9CA3AF",
  fontSize: 13,
  marginBottom: 10,
},

foodRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 6,
  borderBottomWidth: 1,
  borderBottomColor: "#EEF2F7",
},

foodText: {
  fontSize: 13,
  color: "#111827",
},

foodKcal: {
  fontSize: 12,
  color: "#6B7280",
},

addButton: {
  marginTop: 12,
  backgroundColor: "#185FA5",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},

addButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,
},
mealStats: {
  flexDirection: "row",
  gap: 6,
  alignItems: "center",
},

mealStatText: {
  fontSize: 10,
  fontWeight: "700",
  color: "#6B7280",
  backgroundColor: "#EEF2F7",
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 6,
},
});