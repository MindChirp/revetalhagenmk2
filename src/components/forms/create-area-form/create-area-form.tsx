import React from "react";
import { Form, FormField } from "../../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AreaTypeSelector from "../../ui/area-type-selector";
import { AnimatePresence } from "framer-motion";
import GridTypeInput from "./grid-type-input";
import CircularTypeInput from "./circular-type-input";

const formSchema = z.object({
  areaType: z.number().min(0),
  areaValues: z.string(),
});

type ChildType = {
  canSubmit: boolean;
};

interface CreateAreaFormProps {
  children?: (props: ChildType) => React.ReactNode;
}
function CreateAreaForm({ children }: CreateAreaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaType: 0,
      areaValues: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const formValues = form.watch();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="areaType"
          render={({ field }) => (
            <AreaTypeSelector
              selectedType={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="areaValues"
          render={({}) => (
            <div className="w-full">
              <AnimatePresence initial={false} mode="wait">
                {formValues.areaType === 0 && <GridTypeInput key={"grid"} />}
                {formValues.areaType === 1 && (
                  <CircularTypeInput key={"circular"} />
                )}
              </AnimatePresence>
            </div>
          )}
        />

        <div className="pt-5">
          {children?.({
            canSubmit: form.formState.isValid && !!form.formState.touchedFields,
          })}
        </div>
      </form>
    </Form>
  );
}

export default CreateAreaForm;
