'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useSelectionStore } from '../lib/useStore';

const items = [
  {
    id: 'Balcon',
    label: 'Balcon',
  },
  {
    id: 'Escalier',
    label: 'Escalier',
  },
  {
    id: "Salle d'info",
    label: "Salle d'info",
  },
  {
    id: 'Couloir',
    label: 'Couloir',
  },
  {
    id: 'Dressing',
    label: 'Dressing',
  },
  {
    id: 'Douche',
    label: 'Douche',
  },
  {
    id: 'Cuisine',
    label: 'Cuisine',
  },
  {
    id: 'Toilettes',
    label: 'Toilettes',
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

export function Task() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: items.map((item) => item.id),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { setTasks } = useSelectionStore.getState(); // récupère la fonction du store
    setTasks(data.items); // enregistre les tâches sélectionnées

    toast.success('Tâches sélectionnées enregistrées', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">
            {JSON.stringify(data.items, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem className="border rounded-md p-4">
              <div className="mb-4">
                <FormLabel className="text-base">Tâche</FormLabel>
                <FormDescription>
                  Sélectionnez les tâches à attribuer.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Ajouter
        </Button>
      </form>
    </Form>
  );
}
