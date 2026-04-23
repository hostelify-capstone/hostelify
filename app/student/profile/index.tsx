import React from "react";
import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import Svg, { Polygon, Line, Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

const MOCK_PROFILE = {
  name: "Binita Sharma",
  badge: "New student",
  school: "Harvey Mudd College",
  state: "California",
  age: 18,
  mother: "Anita Sharma",
  father: "Sujit Sharma",
  studentUid: "12323249",
  dob: "2004-03-01",
  categoryCode: "GEN",
  gender: "F",
  studentMobile: "7003165426",
  studentEmail: "binita.12323249@lpu.in",
  fatherMobile: "9875547124",
  motherMobile: "919007871308",
  fatherEmail: "Sharma.sujit622@gmail.com",
};

const INTERESTS = [
  { label: "Sport", value: 30, color: "#2EAA7D" },
  { label: "Reading", value: 80, color: "#2EAA7D" },
  { label: "Hi-tech", value: 40, color: "#2EAA7D" },
  { label: "Music/Art", value: 90, color: "#F05656" },
  { label: "Science", value: 50, color: "#2EAA7D" },
];

const CONTACTS = [
  { id: 1, name: "Sade W.", avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Ayaan F.", avatar: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Alex T.", avatar: "https://i.pravatar.cc/100?img=3" },
];

const RadarChart = () => {
  const size = 160;
  const center = size / 2;
  const radius = size / 2.5;

  return (
    <View style={styles.radarContainer}>
      <Svg height={size} width={size}>
        {/* Axes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(rad)}
              y2={center + radius * Math.sin(rad)}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          );
        })}
        {/* Background Web */}
        <Polygon
          points="80,16 135,48 135,112 80,144 25,112 25,48"
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="1"
        />
        {/* Data Polygons */}
        <Polygon
          points="80,40 110,60 110,100 80,90 60,100 50,60"
          fill="rgba(240, 86, 86, 0.7)"
        />
        <Polygon
          points="80,60 120,80 100,120 70,110 40,80 60,50"
          fill="rgba(46, 170, 125, 0.7)"
        />
      </Svg>
      {/* Labels */}
      <Text style={[styles.radarLabel, { top: 0 }]}>Conscientiousness</Text>
      <Text style={[styles.radarLabel, { right: -20, top: 40 }]}>Neuroticism</Text>
      <Text style={[styles.radarLabel, { right: -20, bottom: 40 }]}>Extraversion</Text>
      <Text style={[styles.radarLabel, { bottom: 0 }]}>Agreeableness</Text>
      <Text style={[styles.radarLabel, { left: -10, bottom: 40 }]}>Openness</Text>
      <Text style={[styles.radarLabel, { left: -10, top: 40 }]}>Stability</Text>
    </View>
  );
};

export default function StudentProfileScreen() {
  return (
    <StudentShell title="Profile" subtitle="Student overview and details">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* TOP HEADER SECTION */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Image
              source={{ uri: "https://i.pravatar.cc/300?img=5" }}
              style={styles.mainAvatar}
            />
            <View style={styles.headerInfo}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{MOCK_PROFILE.badge}</Text>
              </View>
              <Text style={styles.studentName}>{MOCK_PROFILE.name}</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>School </Text>
                <Text style={styles.metaValue}>{MOCK_PROFILE.school} {MOCK_PROFILE.state}</Text>
                <Text style={styles.metaLabel}>   Age </Text>
                <Text style={styles.metaValue}>{MOCK_PROFILE.age}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Mother </Text>
                <Text style={styles.metaValue}>{MOCK_PROFILE.mother}</Text>
                <Text style={styles.metaLabel}>   Father </Text>
                <Text style={styles.metaValue}>{MOCK_PROFILE.father}</Text>
              </View>

              <View style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>View full profile</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.gridRow}>
          {/* AREAS OF INTEREST */}
          <Card style={[styles.gridItem, { flex: 1 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Areas of interest</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color="#B0B0B0" />
            </View>
            <Text style={styles.subtext}>Key hobbies • <Text style={{fontWeight: '600', color: '#555'}}>painting, reading</Text></Text>
            
            <View style={styles.barsContainer}>
              {INTERESTS.map((item, index) => (
                <View key={index} style={styles.barRow}>
                  <Text style={styles.barLabel}>{item.label}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${item.value}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* TRAITS OF CHARACTER */}
          <Card style={[styles.gridItem, { flex: 1 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Traits of character</Text>
              <Text style={styles.linkText}>See full map</Text>
            </View>
            <View style={styles.radarWrapper}>
               <RadarChart />
            </View>
          </Card>
        </View>

        <View style={styles.gridRow}>
          {/* SOCIAL CONTACTS */}
          <Card style={[styles.gridItem, { flex: 0.8 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Social contacts</Text>
              <Text style={styles.linkText}>See all</Text>
            </View>
            <View style={styles.contactsRow}>
              {CONTACTS.map(contact => (
                <View key={contact.id} style={styles.contactItem}>
                  <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
                  <Text style={styles.contactName}>{contact.name}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.friendsCount}>Number of Facebook friends <Text style={{fontWeight: 'bold'}}>78</Text></Text>
          </Card>

          {/* ACADEMIC PERFORMANCE */}
          <Card style={[styles.gridItem, { flex: 1.2 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Academic performance</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color="#B0B0B0" />
            </View>
            <View style={styles.chartWrapper}>
              <LineChart
                data={{
                  labels: ["03/20", "06/20", "09/20", "12/20"],
                  datasets: [{ data: [40, 55, 30, 70] }]
                }}
                width={screenWidth > 500 ? screenWidth * 0.4 : screenWidth - 80}
                height={160}
                withDots={true}
                withInnerLines={true}
                withOuterLines={false}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(46, 170, 125, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
                  strokeWidth: 3,
                  propsForDots: { r: "4", strokeWidth: "2", stroke: "#F05656" }
                }}
                bezier
                style={{ marginLeft: -20 }}
              />
            </View>
          </Card>
        </View>

        {/* PERSONAL RECOMMENDATIONS */}
        <Text style={styles.mainHeading}>Personal recommendations</Text>
        <Card style={styles.recommendationCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#FDECEC' }]}>
            <Ionicons name="flash" size={24} color="#F05656" />
          </View>
          <View style={styles.recTextContainer}>
            <Text style={styles.recTitle}>High stress level</Text>
            <Text style={styles.recDesc}>Personal psychological consultation recommended</Text>
          </View>
        </Card>
        <Card style={styles.recommendationCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#EAF8F3' }]}>
            <Ionicons name="color-palette" size={24} color="#2EAA7D" />
          </View>
          <View style={styles.recTextContainer}>
            <Text style={styles.recTitle}>Afterschool programs</Text>
            <Text style={styles.recDesc}>A penchant for art. Drawing classes recommended</Text>
          </View>
        </Card>

        {/* MEDICAL HISTORY */}
        <Text style={styles.mainHeading}>Medical history</Text>
        <Card style={styles.medicalCard}>
          <View style={styles.medicalHeader}>
            <Text style={styles.recTitle}>Anxiety disorder</Text>
            <Text style={styles.medicalCode}>F41.9</Text>
          </View>
          <Text style={styles.recDesc}>Personal consultation recommended</Text>
          <View style={styles.medicalFooter}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#F05656' }]} />
              <Text style={styles.statusText}>Active</Text>
            </View>
            <Text style={styles.linkText}>See full history →</Text>
          </View>
        </Card>

        <Card style={styles.medicalCard}>
          <View style={styles.medicalHeader}>
            <Text style={styles.recTitle}>Mild depressive episode</Text>
            <Text style={styles.medicalCode}>F32.0</Text>
          </View>
          <Text style={styles.recDesc}>End of last disease episode - 03/08/19</Text>
          <View style={styles.medicalFooter}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#2EAA7D' }]} />
              <Text style={styles.statusText}>Cured</Text>
            </View>
            <Text style={styles.linkText}>See full history →</Text>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Contact parents</Text>
            </View>
            <View style={styles.solidButton}>
              <Text style={styles.solidButtonText}>Consultation</Text>
            </View>
          </View>
        </Card>

        {/* PERSONAL INFORMATION GRID */}
        <Text style={[styles.mainHeading, { color: '#F47B62', marginTop: 30 }]}>
          <Ionicons name="person" size={20} color="#F47B62" /> Personal Information
        </Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <InfoField label="Student Uid" value={MOCK_PROFILE.studentUid} />
            <InfoField label="Date Of Birth" value={MOCK_PROFILE.dob} />
            <InfoField label="Name" value={MOCK_PROFILE.name} />
            <InfoField label="Category Code" value={MOCK_PROFILE.categoryCode} />
            <InfoField label="Fathername" value={MOCK_PROFILE.father} />
            <InfoField label="Father Mobile" value={MOCK_PROFILE.fatherMobile} icon="phone-portrait-outline" />
            <InfoField label="Mothername" value={MOCK_PROFILE.mother} />
            <InfoField label="Mother Mobile" value={MOCK_PROFILE.motherMobile} icon="phone-portrait-outline" />
            <InfoField label="Gender" value={MOCK_PROFILE.gender} />
            <InfoField label="Student Mobile" value={MOCK_PROFILE.studentMobile} icon="phone-portrait-outline" />
            <InfoField label="Student Official Email" value={MOCK_PROFILE.studentEmail} icon="mail-outline" />
            <InfoField label="Father Email" value={MOCK_PROFILE.fatherEmail} icon="mail-outline" />
          </View>
        </Card>

      </ScrollView>
    </StudentShell>
  );
}

const InfoField = ({ label, value, icon }: { label: string, value: string, icon?: any }) => (
  <View style={styles.infoFieldWrapper}>
    <Text style={styles.infoFieldLabel}>{label}</Text>
    <View style={styles.infoFieldInput}>
      {icon && <Ionicons name={icon} size={16} color="#888" style={{ marginRight: 8 }} />}
      <Text style={styles.infoFieldValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
    paddingBottom: 40,
  },
  headerCard: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  mainAvatar: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  badge: {
    backgroundColor: '#2EAA7D',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  studentName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaLabel: {
    color: '#888',
    fontSize: 14,
  },
  metaValue: {
    color: '#444',
    fontSize: 14,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#2EAA7D',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  outlineButtonText: {
    color: '#2EAA7D',
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: screenWidth > 768 ? 'row' : 'column',
    gap: 16,
  },
  gridItem: {
    padding: 20,
    minHeight: 250,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  subtext: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  barsContainer: {
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barLabel: {
    width: 70,
    fontSize: 13,
    color: '#555',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: 200,
  },
  radarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#666',
  },
  linkText: {
    color: '#2EAA7D',
    fontSize: 13,
    fontWeight: '600',
  },
  contactsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 16,
  },
  contactItem: {
    alignItems: 'center',
    gap: 8,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  contactName: {
    fontSize: 12,
    color: '#555',
  },
  friendsCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: -10,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  recommendationCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FAFAFA',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTextContainer: {
    flex: 1,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 13,
    color: '#777',
  },
  medicalCard: {
    padding: 20,
    gap: 12,
  },
  medicalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicalCode: {
    fontSize: 13,
    color: '#888',
  },
  medicalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  solidButton: {
    backgroundColor: '#2EAA7D',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  solidButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoCard: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoFieldWrapper: {
    width: screenWidth > 768 ? '33.33%' : '100%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoFieldLabel: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    marginBottom: -8,
    marginLeft: 12,
    zIndex: 1,
  },
  infoFieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  infoFieldValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

