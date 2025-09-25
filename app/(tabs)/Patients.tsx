// app/(tabs)/patients.tsx
import { Eye, FileText, Search } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

type Patient = {
  id: string;
  name: string;
  mrNumber: string;
  uniqueKey: string;
  age: number;
  diagnosis: string;
  ward: string;
  doctor: string;
  status: "Stable" | "Monitoring" | "Recovering" | "Critical";
  phone: string;
  admissionDate: string;
  room: string;
};

// Generate 20 patients
const patients: Patient[] = Array.from({ length: 20 }, (_, i) => ({
  id: `PAT${i + 1}`,
  name: `Patient ${i + 1}`,
  mrNumber: `MR${(i + 1).toString().padStart(3, "0")}`,
  uniqueKey: `UK${(i + 1).toString().padStart(3, "0")}`,
  age: 20 + (i % 50),
  diagnosis: ["Pneumonia", "Diabetes", "Surgery", "Observation"][i % 4],
  ward: ["General Ward", "Endocrine Ward", "Surgical Ward", "Cardiology"][i % 4],
  doctor: ["Dr. Smith", "Dr. Wilson", "Dr. Brown", "Dr. Johnson"][i % 4],
  status: ["Stable", "Monitoring", "Recovering", "Critical"][i % 4] as Patient["status"],
  phone: `+1-555-0${100 + i}`,
  admissionDate: `2025-09-${(10 + i).toString().padStart(2, "0")}`,
  room: ["A-101", "B-205", "C-310", "ICU-02"][i % 4],
}));

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [patientList, setPatientList] = useState<Patient[]>(patients);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // simulate API call
    setTimeout(() => {
      setPatientList(prev => [
        ...prev,
        {
          id: `PAT${prev.length + 1}`,
          name: `Patient ${prev.length + 1}`,
          mrNumber: `MR${(prev.length + 1).toString().padStart(3, "0")}`,
          uniqueKey: `UK${(prev.length + 1).toString().padStart(3, "0")}`,
          age: 30,
          diagnosis: "New Diagnosis",
          ward: "New Ward",
          doctor: "Dr. New",
          status: "Stable",
          phone: "+1-555-0999",
          admissionDate: `2025-09-30`,
          room: "Z-999",
        },
      ]);
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredPatients = patientList.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uniqueKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setModalVisible(false);
  };

  const renderPatient = ({ item }: { item: Patient }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.split(" ").map(n => n[0]).join("")}</Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientMR}>{item.mrNumber}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.statusBadge,
              item.status === "Critical"
                ? styles.critical
                : item.status === "Monitoring"
                ? styles.monitoring
                : item.status === "Recovering"
                ? styles.recovering
                : styles.stable,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Diagnosis:</Text>
        <Text style={styles.infoValue}>{item.diagnosis}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => openModal(item)}>
          <Eye size={16} color="#fff" />
          <Text style={styles.buttonText}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => openModal(item)}>
          <FileText size={16} color="#fff" />
          <Text style={styles.buttonText}>Lab Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal(item)}>
          <FileText size={16} color="#fff" />
          <Text style={styles.buttonText}>Radiology</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <View style={styles.searchContainer}>
          <Search size={16} color="#454242ff" />
          <TextInput
            placeholder="Search by name, MR, or key"
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A652"]} />
        }
      />

      {/* Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{selectedPatient?.name}</Text>
            <Text>MR Number: {selectedPatient?.mrNumber}</Text>
            <Text>Unique Key: {selectedPatient?.uniqueKey}</Text>
            <Text>Age: {selectedPatient?.age}</Text>
            <Text>Phone: {selectedPatient?.phone}</Text>
            <Text>Diagnosis: {selectedPatient?.diagnosis}</Text>
            <Text>Ward: {selectedPatient?.ward}</Text>
            <Text>Room: {selectedPatient?.room}</Text>
            <Text>Doctor: {selectedPatient?.doctor}</Text>
            <Text>Status: {selectedPatient?.status}</Text>
            <Text>Admission Date: {selectedPatient?.admissionDate}</Text>
          </ScrollView>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: { flex: 1, paddingVertical: 6, paddingHorizontal: 8 },

  card: { backgroundColor: "#fff", margin: 8, borderRadius: 10, padding: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "700" },
  patientName: { fontWeight: "600" },
  patientMR: { color: "#666", fontSize: 12 },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    textAlign: "center",
  },
  critical: { backgroundColor: "#fecaca", color: "#991b1b" },
  monitoring: { backgroundColor: "#fef3c7", color: "#78350f" },
  recovering: { backgroundColor: "#bbf7d0", color: "#00A652" },
  stable: { backgroundColor: "#bfdbfe", color: "#1e40af" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  infoLabel: { fontWeight: "600" },
  infoValue: { color: "#444" },

  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#00A652",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", marginLeft: 4 },

  modal: { justifyContent: "center", margin: 16 },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  closeButton: {
    backgroundColor: "#00A652",
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
  },
});
