export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  company: string;
  joinedMinAgo?: number;
  linkedinUrl: string;
}

export const attendees: Attendee[] = [
  { id: "1", firstName: "Aisha", lastName: "Okafor", initials: "AO", title: "VP Partnerships", company: "Microsoft", joinedMinAgo: 2, linkedinUrl: "#" },
  { id: "2", firstName: "Carlos", lastName: "Mendoza", initials: "CM", title: "Founder", company: "NexGen AI", joinedMinAgo: 4, linkedinUrl: "#" },
  { id: "3", firstName: "David", lastName: "Kim", initials: "DK", title: "Sr. Manager BD", company: "Salesforce", joinedMinAgo: 7, linkedinUrl: "#" },
  { id: "4", firstName: "James", lastName: "Morrison", initials: "JM", title: "SVP Sales", company: "Oracle", linkedinUrl: "#" },
  { id: "5", firstName: "Jennifer", lastName: "Walsh", initials: "JW", title: "Head of Talent", company: "HubSpot", linkedinUrl: "#" },
  { id: "6", firstName: "Lisa", lastName: "Park", initials: "LP", title: "Chief of Staff", company: "Coinbase", linkedinUrl: "#" },
  { id: "7", firstName: "Marcus", lastName: "Rivera", initials: "MR", title: "Dir. Product", company: "Stripe", linkedinUrl: "#" },
  { id: "8", firstName: "Priya", lastName: "Sharma", initials: "PS", title: "CTO", company: "Acme Corp", linkedinUrl: "#" },
  { id: "9", firstName: "Robert", lastName: "Tanaka", initials: "RT", title: "Principal Engineer", company: "Netflix", linkedinUrl: "#" },
  { id: "10", firstName: "Sarah", lastName: "Chen", initials: "SC", title: "VP Engineering", company: "Google", linkedinUrl: "#" },
];

export const sessionInfo = {
  eventName: "RUMC Job Networking",
  sessionName: "Career Quest Workshop",
  room: "Room 101",
  timeRange: "1:00 PM – 3:00 PM",
  timeRangeShort: "1–3 PM",
  attendeeCount: 38,
};
