import { getAllEntries } from "./backend";

export const getAiMood = async (text) => {
  console.log("Creating session and prompting AI");
  try {
    const { available } = await ai.languageModel.capabilities();
    const session = await ai.languageModel.create();

    if (available !== "no") {
      console.log("Session created");
      console.log(text);
      console.log(session);
      const result = await session.prompt(
        "In just one Word. return a mood from the list - (Happy, Sad, Anxious, Angry, Frustrated, Neutral, Peaceful) that you think the person was in when they wrote the text" +
          text,
      );
      console.log("Prompted AI");
      console.log(result);
      const newRes = result.split(" ")[0];
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

export const generateAiSummaryForDates = async (dates) => {
  console.log("Generating AI summary for dates", dates);
  try {
    const { available } = await ai.languageModel.capabilities();

    if (available !== "no") {
      // Get all entries
      const allEntries = await getAllEntries();

      // Filter entries for the specified dates
      const relevantEntries = dates.reduce((acc, date) => {
        if (allEntries[date]) {
          acc[date] = allEntries[date];
        }
        return acc;
      }, {});

      // Check if we have any entries to summarize
      const entriesCount = Object.keys(relevantEntries).length;
      if (entriesCount === 0) {
        return {
          summary: "No entries found for the selected dates.",
          calculatedResponseTime: 0,
        };
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
      return {
        errorMessage:
          "Sorry, I can't create a session right now. Please try again later.",
        calculatedResponseTime: 0,
      };
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      errorMessage: error.message || "Failed to generate summary",
      calculatedResponseTime: 0,
    };
  }
};
