import { getAllEntries } from "./backend";

export const getAiMood = async (textObj) => {
  console.log("Creating session and prompting AI");
  try {
    const { available } = await ai.languageModel.capabilities();
    const session = await ai.languageModel.create();
    const combinedText = [
      textObj.journal,
      ...(textObj.grateful || []).filter(Boolean),
      textObj.goals,
    ]
      .filter(Boolean)
      .join(" ");

    if (available !== "no") {
      console.log("Session created");
      console.log(combinedText);
      console.log(session);
      const prompt = `
      Reply with a single sentence using one of the below words that best describes the journal entry below
      
      VALID MOOD OPTIONS:
      Happy
      Sad
      Anxious
      Angry
      Frustrated
      Neutral
      Peaceful
 
      Journal entry below
      `;
      const result = await session.prompt(prompt + combinedText);
      console.log(result);
      const moods = [
        "Happy",
        "Sad",
        "Anxious",
        "Angry",
        "Frustrated",
        "Neutral",
        "Peaceful",
      ];
      // determine mood by schekcing if string respose contains any of the moods
      const mood =
        moods.find((m) => result.trim().toLowerCase() === m.toLowerCase()) ||
        moods.find((m) => result.toLowerCase().includes(m.toLowerCase()));

      console.log("Mood determined by AI", mood);

      const newRes = mood;
      return newRes;
    } else {
      return {
        errorMessage:
          "Sorry, I can't create a session right now. Please try again later.",
      };
    }
  } catch (error) {
    return {
      errorMessage: error.message,
    };
  }
};

export const getAiQuote = async () => {
  console.log("Creating session and prompting AI");
  try {
    const { available } = await ai.languageModel.capabilities();
    const session = await ai.languageModel.create();

    if (available !== "no") {
      console.log("Session created");
      console.log(session);
      const result = await session.prompt(
        "Generate a quote that is motivational and inspiring, under 50 charectors",
      );
      console.log(result);
      return result;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const generateAiSummaryForDates = async (dates) => {
  console.log("Generating AI summary for dates", dates);
  try {
    const { available } = await ai.languageModel.capabilities();

    if (available !== "no") {
      // Get all entries
      const allEntries = await getAllEntries();

      // Filter entries for the specified dates
      // const relevantEntries = dates.reduce((acc, date) => {
      //   if (allEntries[date]) {
      //     acc[date] = allEntries[date];
      //   }
      //   return acc;
      // }, {});
      const relevantEntries = allEntries;
      console.log("Relevant entries", relevantEntries);

      // Check if we have any entries to summarize
      const entriesCount = Object.keys(relevantEntries).length;
      if (entriesCount === 0) {
        return "No entries found for the specified dates";
      }

      // const entriesCount = 7;

      // Create a session for AI processing
      const session = await ai.languageModel.create();

      console.log("Session created");
      console.log(session);
      console.log(relevantEntries);

      // Format entries for the prompt
      const formattedEntries = Object.entries(relevantEntries)
        .map(([date, data]) => {
          const { entry, mood } = data;
          return `Date: ${date}\nMood: ${mood}\nGoals: ${entry.goals}\nGrateful: ${entry.grateful.join(", ")}\nJournal: ${entry.journal}`;
        })
        .join("\n\n");

      console.log(">>>>>" + formattedEntries);

      // const formattedEntries =
      // `Today was a challenging day at work. I struggled with deadlines but managed to stay focused.
      //  Feeling better today. Had a productive meeting and accomplished key tasks.
      //  Spent time with family. It really helped improve my mood.
      //  Dealing with some stress but practicing meditation helps.
      //  Made significant progress on the project. Team dynamics are improving.
      //  Taking time for self-care and reflection. Feeling more balanced.
      //  End of week review. Overall positive despite some obstacles.`;

      // Generate prompt based on number of entries
      const prompt = `Here are journal entries from ${entriesCount} different dates. Please provide a very short atleast two lines summary that connects these entries:\n\n${formattedEntries}`;

      // Get AI response
      const response = await session.prompt(prompt);
      console.log("Prompted AI", response);
      return response;
    } else {
      return "Sorry, I can't create a session right now. Please try again later.";
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary";
  }
};
