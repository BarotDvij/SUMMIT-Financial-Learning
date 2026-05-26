import { defineType, defineField } from 'sanity';

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'module',
      type: 'reference',
      to: [{ type: 'module' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'estimatedMinutes', type: 'number', initialValue: 5 }),
    defineField({ name: 'xpReward', type: 'number', initialValue: 50 }),
    defineField({
      name: 'gameSlug',
      type: 'string',
      description: 'Optional slug of the mini-game that follows the lesson.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
        },
        {
          type: 'object',
          name: 'callout',
          fields: [
            { name: 'tone', type: 'string', options: { list: ['info', 'warning'] } },
            { name: 'text', type: 'text' },
          ],
        },
      ],
    }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'module.title' },
  },
});
