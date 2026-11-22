import { defaultMilestones, type GardenType, type Language, type PlantStage, type SpaceSize, type Sunlight } from "@/lib/garden-data";

export type UserProfile = {
  name: string;
  city: string;
  experience: "Beginner" | "Some experience" | "Experienced";
  gardenType: GardenType;
  space: SpaceSize;
  age: string;
  email: string;
  language: Language;
  preferredCrops: string[];
};

export type WateringRecord = { date: string; note: string };

export type GardenPlant = {
  id: string;
  cropId: string;
  nickname: string;
  plantedAt: string;
  stage: PlantStage;
  observations: string[];
  wateringHistory: WateringRecord[];
  photoDataUrl: string | null;
};

export type CareTask = {
  id: string;
  title: string;
  type: "Watering" | "Fertilizing" | "Pruning" | "Planting" | "Pest inspection" | "Harvesting" | "Custom";
  dueDate: string;
  plantId: string | null;
  done: boolean;
};

export type HarvestEntry = {
  id: string;
  cropId: string;
  plantedAt: string;
  harvestDate: string;
  quantity: number;
  unit: "g" | "kg" | "pieces";
  notes: string;
  photoDataUrl: string | null;
};

export type CommunityComment = { id: string; text: string; createdAt: string };

export type CommunityPost = {
  id: string;
  author: string;
  title: string;
  body: string;
  category: "Garden update" | "Harvest" | "Tip";
  imageDataUrl: string | null;
  likes: number;
  liked: boolean;
  comments: CommunityComment[];
  isDemo: boolean;
};

export type GardenData = {
  schemaVersion: 1;
  mode: "welcome" | "guest" | "profile";
  profile: UserProfile | null;
  language: Language;
  plants: GardenPlant[];
  tasks: CareTask[];
  harvests: HarvestEntry[];
  posts: CommunityPost[];
  planner: { widthCm: number; lengthCm: number; gardenType: GardenType; sunlight: Sunlight; cropIds: string[] };
  milestones: { families: number; collaborators: number };
};

const STORAGE_KEY = "nurture-sapling-garden-v1";

function demoCommunityPosts(): CommunityPost[] {
  return [
    { id: "demo-1", author: "Demo gardener", title: "Making the most of a sunny ledge", body: "A handful of small pots can hold coriander, mint, and quick leafy greens. This sample post is demonstration content, not a public community update.", category: "Tip", imageDataUrl: null, likes: 4, liked: false, comments: [{ id: "demo-comment-1", text: "Demo comment — small batches make care easier.", createdAt: "" }], isDemo: true },
    { id: "demo-2", author: "Demo gardener", title: "A little harvest from a container", body: "Check the soil before watering and harvest outer leaves first. This locally stored example is shown only to demonstrate the community tools.", category: "Harvest", imageDataUrl: null, likes: 2, liked: false, comments: [], isDemo: true },
  ];
}

export function createEmptyGarden(): GardenData {
  return {
    schemaVersion: 1,
    mode: "welcome",
    profile: null,
    language: "en",
    plants: [],
    tasks: [],
    harvests: [],
    posts: demoCommunityPosts(),
    planner: { widthCm: 120, lengthCm: 180, gardenType: "Balcony", sunlight: "full", cropIds: [] },
    milestones: { ...defaultMilestones },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function loadGarden(): GardenData {
  if (typeof window === "undefined") return createEmptyGarden();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyGarden();
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return createEmptyGarden();
    const defaults = createEmptyGarden();
    return {
      ...defaults,
      ...parsed,
      schemaVersion: 1,
      plants: Array.isArray(parsed["plants"]) ? parsed["plants"] as GardenData["plants"] : defaults.plants,
      tasks: Array.isArray(parsed["tasks"]) ? parsed["tasks"] as GardenData["tasks"] : defaults.tasks,
      harvests: Array.isArray(parsed["harvests"]) ? parsed["harvests"] as GardenData["harvests"] : defaults.harvests,
      posts: Array.isArray(parsed["posts"]) ? parsed["posts"] as GardenData["posts"] : defaults.posts,
      planner: isRecord(parsed["planner"]) ? { ...defaults.planner, ...parsed["planner"] } as GardenData["planner"] : defaults.planner,
      milestones: isRecord(parsed["milestones"]) ? { ...defaults.milestones, ...parsed["milestones"] } as GardenData["milestones"] : defaults.milestones,
      profile: isRecord(parsed["profile"]) ? parsed["profile"] as UserProfile : null,
      mode: parsed["mode"] === "profile" || parsed["mode"] === "guest" ? parsed["mode"] : "welcome",
      language: parsed["language"] === "te" || parsed["language"] === "hi" ? parsed["language"] : "en",
    };
  } catch {
    return createEmptyGarden();
  }
}

export function saveGarden(data: GardenData): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function prepareGardenImport(value: unknown): GardenData | null {
  if (!isRecord(value) || !Array.isArray(value["plants"]) || !Array.isArray(value["tasks"]) || !Array.isArray(value["harvests"])) return null;
  const defaults = createEmptyGarden();
  const parsedPosts = Array.isArray(value["posts"]) ? value["posts"] as GardenData["posts"] : defaults.posts;
  const parsedPlanner = isRecord(value["planner"]) ? value["planner"] : defaults.planner;
  const parsedMilestones = isRecord(value["milestones"]) ? value["milestones"] : defaults.milestones;
  return {
    ...defaults,
    ...value,
    schemaVersion: 1,
    plants: value["plants"] as GardenData["plants"],
    tasks: value["tasks"] as GardenData["tasks"],
    harvests: value["harvests"] as GardenData["harvests"],
    posts: parsedPosts,
    planner: { ...defaults.planner, ...parsedPlanner } as GardenData["planner"],
    milestones: { ...defaults.milestones, ...parsedMilestones } as GardenData["milestones"],
    profile: isRecord(value["profile"]) ? value["profile"] as UserProfile : null,
    language: value["language"] === "te" || value["language"] === "hi" ? value["language"] : "en",
    mode: value["mode"] === "profile" || value["mode"] === "guest" ? value["mode"] : "welcome",
  };
}