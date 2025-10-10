'use server';

/**
 * @fileOverview A flow that summarizes recycling guides based on a user query.
 *
 * - summarizeRecyclingGuides - A function that takes a user query and returns a summarized response from the recycling guides.
 * - SummarizeRecyclingGuidesInput - The input type for the summarizeRecyclingGuides function.
 * - SummarizeRecyclingGuidesOutput - The return type for the summarizeRecyclingGuides function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRecyclingGuidesInputSchema = z.object({
  query: z.string().describe('The user query to summarize the recycling guides.'),
});
export type SummarizeRecyclingGuidesInput = z.infer<typeof SummarizeRecyclingGuidesInputSchema>;

const SummarizeRecyclingGuidesOutputSchema = z.object({
  summary: z.string().describe('The summarized response from the recycling guides.'),
});
export type SummarizeRecyclingGuidesOutput = z.infer<typeof SummarizeRecyclingGuidesOutputSchema>;

export async function summarizeRecyclingGuides(
  input: SummarizeRecyclingGuidesInput
): Promise<SummarizeRecyclingGuidesOutput> {
  return summarizeRecyclingGuidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRecyclingGuidesPrompt',
  input: {schema: SummarizeRecyclingGuidesInputSchema},
  output: {schema: SummarizeRecyclingGuidesOutputSchema},
  prompt: `You are a helpful assistant that summarizes recycling guides based on the user query.

  User Query: {{{query}}}
  
  Please provide a concise and informative summary that addresses the user's query using the recycling guides information.`,
});

const summarizeRecyclingGuidesFlow = ai.defineFlow(
  {
    name: 'summarizeRecyclingGuidesFlow',
    inputSchema: SummarizeRecyclingGuidesInputSchema,
    outputSchema: SummarizeRecyclingGuidesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
