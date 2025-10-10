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
  wasteType: z.string().describe('The classified type of waste.'),
  disposalInstructions:
    z.string().describe('Instructions on how to properly dispose of the waste.'),
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

  Analyze the image of the waste provided and classify the waste type. Provide clear and concise instructions on how to properly dispose of the identified waste.

  Consider local recycling guidelines and regulations when providing disposal instructions.

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
