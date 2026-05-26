import { defineType, defineField } from 'sanity';

export const module = defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().min(2).max(200) }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tier',
      type: 'string',
      options: { list: ['fundamentals', 'intermediate', 'advanced'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
});
