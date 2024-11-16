export const createTextSessionAndPrompt = async (text) => {
    console.log("Creating session and prompting AI");
    try {
        const { available } = await ai.languageModel.capabilities();
        const session = await ai.languageModel.create();
        
        console.log("Session created");

        if (available !== "no") {
            const result = await session.prompt(
                "return a mood that you think the person was in when they wrote the text" + text
            );

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
