# AI Tutor (Phase 3)

A scoped, opt-in tutor that lives next to a lesson. Phase 3 ship.

## Constraints

- Must be enable-able per organization by the district admin. Default off.
- Must never use identifiable student data to train a third-party model.
- Must be grounded to the current lesson's Sanity content (RAG over that
  single document).
- Hard refusal for off-topic prompts ("write my essay", financial advice,
  homework cheating, personal advice).
- Logs every request with a redacted prompt + lesson id for moderation.

## Stack

- **Vercel AI SDK** for streaming + tool calling.
- **Vercel AI Gateway** as a multi-provider proxy so we can switch from
  Claude → GPT → Mistral without code changes.
- **Pinecone** (or Vercel Postgres `pgvector`) for embeddings of lesson
  content.

## Endpoint sketch

`POST /api/tutor/ask`:
```json
{ "lessonId": "uuid", "prompt": "What's the difference between TFSA and RRSP?" }
```

Server logic:
1. `requireStudentWritable(ctx.user)` (or equivalent for teachers).
2. Verify `organization.ai_tutor_enabled === true`.
3. Load the lesson body from Sanity.
4. Embed prompt, retrieve top-k chunks from the lesson body.
5. Stream a response with a safety system prompt that limits scope.
6. Persist a redacted log row.

## Streaming wire-up (web)

```tsx
import { useChat } from 'ai/react';
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/tutor/ask',
  body: { lessonId },
});
```

## Phase 3 success metrics

- ≥ 30% of students who open a lesson interact with the tutor.
- ≥ 90% of tutor answers rated "helpful" by sampled review.
- 0 incidents of the tutor giving financial advice or off-topic answers.
