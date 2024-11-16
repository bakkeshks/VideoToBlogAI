const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateBlogPost = async (transcriptText) => {
  try {
    const genAI = new GoogleGenerativeAI(
      (apiKey = process.env.GEMINIAI_API_KEY)
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Generate a detailed and insightful technical blog post based on the following text: ${transcriptText}. The blog post should be between 700 and 2500 words and must include the following:

    1. **Introduction (Mandatory):**
       - Start with a captivating hook or opening sentence that grabs the reader's attention.
       - Write a two-paragraph introduction:
         - The first paragraph should introduce the main technical theme or topic discussed in the transcript without using phrases like "The transcript introduces" or "The transcript highlights."
         - The second paragraph (mandatory) should start with a phrase like "In this blog post" or "This blog post covers" to outline what will be covered in the post and explain why it is important to the audience.
    
    2. **Detailed Explanation of Key Concepts:** 
       - Break down and explain the core concepts in depth, ensuring clarity and thoroughness.
       - Incorporate relevant code snippets, diagrams, or other visual aids to illustrate technical points.
       - Include tables, step-by-step guides, or quotations as needed to clarify complex information and enhance understanding.
    
    3. **Conclusion (Mandatory):**
       - Write a two-paragraph conclusion:
         - The first paragraph should summarize the key points discussed in the post.
         - The second paragraph should offer final thoughts, actionable recommendations, or next steps for the reader.

    4. **FAQ (Mandatory):**
	- Include a FAQ section addressing common questions or concerns related to the topic discussed.
	- Provide concise answers (1-2 sentences per question) to each question to enhance understanding and engagement with the content.

    
    **Desired Tone and Style:**
       - Maintain a professional, engaging, and conversational writing style throughout the post.
       - Aim for an informative and analytical tone that clearly explains technical concepts in a relatable way.
    
    **SEO and Readability:**
       - Ensure the article is SEO-friendly. Incorporate relevant keywords naturally throughout the content without keyword stuffing.
       - Choose a compelling, keyword-rich title (less than 65 characters) that accurately reflects the content and attracts readers. Format the title using # at the beginning.
       - Use descriptive and keyword-rich subheadings (\`##\` and \`###\`) to improve readability and SEO.
       - Focus on readability by organizing content logically, using short paragraphs, and varying sentence structure.
       - Use appropriate punctuation, such as commas (,) and periods (.), instead of semicolons (;) unless necessary for clarity.
       - Format the content output in Markdown format to ensure readability and structured presentation.
    
    The post should have a clear hierarchy of headings and a logical flow, with each section building on the previous one to provide a comprehensive overview of the topic. Ensure the content is engaging, informative, and easy to navigate.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Error during blog post generation", error);
    throw error;
  }
};

module.exports = { generateBlogPost };
