import {
  DeepPartial,
  DeepReplaceKeys,
  pickDeep,
  PickDeep,
} from "ts-util-helpers";
import * as fs from "fs";
import matter from "gray-matter";
import { countContent } from "utils/count-words";

interface MarkdownAdditions {
  content: string;
  wordCount: number;
}

export function readMarkdownFile<
  T,
  ToPick extends DeepPartial<
    DeepReplaceKeys<T & MarkdownAdditions>
  > = DeepPartial<DeepReplaceKeys<T & MarkdownAdditions>>
>(
  filePath: string,
  fields: ToPick
): {
  frontmatterData: Record<string, any>;
  pickedData: PickDeep<T & MarkdownAdditions, ToPick>;
  content: string;
} {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data: frontmatterData, content } = matter(fileContents);
  const counts = countContent(content)

  // Ensure only the minimal needed data is exposed
  const pickedData = pickDeep(
    frontmatterData,
    fields as DeepReplaceKeys<typeof frontmatterData>
  );

  if (fields.content) {
    pickedData.content = content;
  }
  if (fields.wordCount) {
    pickedData.wordCount =
      (counts.InlineCodeWords || 0) + (counts.WordNode || 0);
  }

  return {
    frontmatterData,
    pickedData: pickedData as any,
    content,
  };
}
