import { describe, expect, it } from "vitest";

import { answerGardenQuestion, assessSymptoms, defaultMilestones, recommendCrops } from "@/lib/garden-data";
import { createEmptyGarden } from "@/lib/garden-storage";

describe("curated Nurture Sapling rules", () => {
  it("keeps small, low-light recommendations within space and sunlight limits", () => {
    const crops = recommendCrops({ space: "Small", sunlight: "partial", experience: "Beginner", season: "Any season", category: "All crops" });

    expect(crops.length).toBeGreaterThan(0);
    expect(crops.every((crop) => crop.spaceFit === "compact" && crop.minSunHours <= 4)).toBe(true);
  });

  it("returns targeted next steps for a selected plant symptom", () => {
    const assessments = assessSymptoms(["holes"]);

    expect(assessments).toHaveLength(1);
    expect(assessments[0]?.title).toBe("Holes in leaves");
    expect(assessments[0]?.steps.length).toBeGreaterThan(0);
  });

  it("answers different supported questions differently and explains the demo limit", () => {
    const watering = answerGardenQuestion("How much water does a chilli plant need?", "en");
    const soil = answerGardenQuestion("Which soil should I use?", "en");
    const unsupported = answerGardenQuestion("Can you confirm a plant diagnosis from my photograph?", "en");

    expect(watering).not.toBe(soil);
    expect(watering).toContain("2–3 cm");
    expect(unsupported).toContain("not a live AI model");
  });

  it("starts with the two project-reported impact figures and no claimed user progress", () => {
    const garden = createEmptyGarden();

    expect(defaultMilestones).toEqual({ families: 2, collaborators: 9 });
    expect(garden.plants).toHaveLength(0);
    expect(garden.harvests).toHaveLength(0);
  });
});