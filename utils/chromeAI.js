export const createTextSessionAndPrompt = async (text) => {
    console.log("Creating session and prompting AI");
    try {
        const { available } = await ai.languageModel.capabilities();
        const session = await ai.languageModel.create();
        
        if (available !== "no") {
            console.log("Session created");
            console.log(text);
            console.log(session);
            const result = await session.prompt(
                "In just one Word. return a mood from the list - (Happy, Sad, Anxious, Angry, Frustrated, Neutral, Peaceful) that you think the person was in when they wrote the text" + text
            );
            console.log("Prompted AI");
            console.log(result);
            return { result};
        } else {
            return {
                errorMessage: "Sorry, I can't create a session right now. Please try again later.",
                calculatedResponseTime: 0,
            };
        }
    } catch (error) {
        return {
            errorMessage: error.message,
            calculatedResponseTime: 0,
        };
    }
};
