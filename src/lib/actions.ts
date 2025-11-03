"use server";

import {
  generateTeachingStrategies,
  GenerateTeachingStrategiesInput,
} from "@/ai/flows/generate-teaching-strategies";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  classPerformanceData: z.string().min(1, "Performance data is required."),
});

type FormState = {
  message: string;
  strategies?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getAIStrategies(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      message: "Please check the fields below.",
      fields: {
        subject: formData.get("subject")?.toString() ?? "",
        gradeLevel: formData.get("gradeLevel")?.toString() ?? "",
        classPerformanceData:
          formData.get("classPerformanceData")?.toString() ?? "",
      },
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: GenerateTeachingStrategiesInput = validatedFields.data;
    const result = await generateTeachingStrategies(input);

    if (result.teachingStrategies) {
      return {
        message: "Strategies generated successfully.",
        strategies: result.teachingStrategies,
      };
    } else {
      return { message: "AI could not generate strategies. Please try again." };
    }
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred. Please try again later." };
  }
}
