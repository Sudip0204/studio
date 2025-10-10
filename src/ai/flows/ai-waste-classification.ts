'use server';

/**
 * @fileOverview Classifies waste materials from an image and provides disposal instructions.
 *
 * - aiWasteClassification - A function that handles the waste classification process.
 * - AiWasteClassificationInput - The input type for the aiWasteClassification function.
 * - AiWasteClassificationOutput - The return type for the aiWasteClassification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiWasteClassificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AiWasteClassificationInput = z.infer<typeof AiWasteClassificationInputSchema>;

const AiWasteClassificationOutputSchema = z.object({
  isWaste: z.boolean().describe('Whether the image contains a recognizable waste product.'),
  wasteType: z.string().describe('The classified type of waste. If not a waste product, this should be "Not a waste product".'),
  disposalInstructions:
    z.string().describe('Instructions on how to properly dispose of the waste. If not a waste product, explain why.'),
});
export type AiWasteClassificationOutput = z.infer<typeof AiWasteClassificationOutputSchema>;

export async function aiWasteClassification(
  input: AiWasteClassificationInput
): Promise<AiWasteClassificationOutput> {
  return aiWasteClassificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiWasteClassificationPrompt',
  input: {schema: AiWasteClassificationInputSchema},
  output: {schema: AiWasteClassificationOutputSchema},
  prompt: `You are an AI assistant specializing in waste classification and disposal methods.

  Analyze the image provided. Determine if it's a waste product.

  If it is a waste product:
  1. Set 'isWaste' to true.
  2. Classify the 'wasteType' (e.g., 'Plastic Bottle', 'Cardboard Box', 'Aluminum Can').
  3. Provide clear and concise 'disposalInstructions'. Mention local recycling guidelines if applicable.

  If it is NOT a waste product (e.g., a person, an animal, a landscape):
  1. Set 'isWaste' to false.
  2. Set 'wasteType' to "Not a waste product".
  3 dashboards. Set 'disposalInstructions' to a brief explanation of what is in the image and why it is not considered waste.

  Photo: {{media url=photoDataUri}}
  `,
});

const aiWasteClassificationFlow = ai.defineFlow(
  {
    name: 'aiWasteClassificationFlow',
    inputSchema: AiWasteClassificationInputSchema,
    outputSchema: AiWasteClassificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
