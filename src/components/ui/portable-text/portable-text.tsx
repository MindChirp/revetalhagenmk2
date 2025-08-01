import type {
  PortableTextBlock,
  RenderBlockFunction,
  RenderDecoratorFunction,
  RenderStyleFunction,
} from "@portabletext/editor";
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import {
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Quote,
  RemoveFormatting,
  Underline,
} from "lucide-react";
import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import PortableH1 from "./render-components/h1";
import PortableH2 from "./render-components/h2";
import PortableH3 from "./render-components/h3";
import PortableQuote from "./render-components/quote";

// ...
const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [
    { name: "strong", title: "Uthevet", icon: <Bold /> },
    { name: "em", title: "Kursiv", icon: <Italic /> },
    { name: "underline", title: "Understreket", icon: <Underline /> },
    { name: "left", title: "Venstrejustert", icon: <AlignLeft /> },
    {
      name: "right",
      title: "Høyrejustert",
      icon: <AlignRight />,
      value: "right",
    },
  ],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [
    { name: "normal", title: "Normal", icon: <RemoveFormatting /> },
    { name: "h1", title: "Tittel 1", icon: <Heading1 /> },
    { name: "h2", title: "Tittel 2", icon: <Heading2 /> },
    { name: "h3", title: "Tittel 3", icon: <Heading3 /> },
    { name: "blockquote", title: "Sitat", icon: <Quote /> },
  ],

  // The types below are left empty for this example.
  // See the rendering guide to learn more about each type.

  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  annotations: [],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [],
});

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === "h1") {
    return <PortableH1>{props.children}</PortableH1>;
  }
  if (props.schemaType.value === "h2") {
    return <PortableH2>{props.children}</PortableH2>;
  }
  if (props.schemaType.value === "h3") {
    return <PortableH3>{props.children}</PortableH3>;
  }
  if (props.schemaType.value === "blockquote") {
    return <PortableQuote>{props.children}</PortableQuote>;
  }
  return <>{props.children}</>;
};

const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === "strong") {
    return <strong>{props.children}</strong>;
  }
  if (props.value === "em") {
    return <em>{props.children}</em>;
  }
  if (props.value === "underline") {
    return <u>{props.children}</u>;
  }
  return <>{props.children}</>;
};

type TextEditorProps = {
  value?: Array<PortableTextBlock>;
  onChange?: (value?: Array<PortableTextBlock>) => void;
};
function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <div onClick={(e) => e.preventDefault()}>
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue: value,
        }}
      >
        <EventListenerPlugin
          on={(event) => {
            if (event.type === "mutation") {
              console.log("CHANGING!");
              onChange?.(event.value);
            }
          }}
        />
        <div className="flex flex-col gap-2.5">
          <Toolbar />
          <PortableTextEditable
            // Add an optional style to see it more easily on the page
            className="border-border rounded-xl border p-5"
            renderStyle={renderStyle}
            renderDecorator={renderDecorator}
            renderListItem={(props) => <>{props.children}</>}
          />
        </div>
      </EditorProvider>
    </div>
  );
}

function Toolbar() {
  // useEditor provides access to the PTE
  const editor = useEditor();

  // Iterate over the schema (defined earlier), or manually create buttons.
  const styleButtons = schemaDefinition.styles.map((style) => (
    <Tooltip key={style.name}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            // Send style toggle event
            editor.send({
              type: "style.toggle",
              style: style.name,
            });
            editor.send({
              type: "focus",
            });
          }}
        >
          {style.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{style.title}</TooltipContent>
    </Tooltip>
  ));

  const decoratorButtons = schemaDefinition.decorators.map((decorator) => (
    <Tooltip key={decorator.name}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            // Send decorator toggle event
            editor.send({
              type: "decorator.toggle",
              decorator: decorator.name,
            });
            editor.send({
              type: "focus",
            });
          }}
        >
          {decorator.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{decorator.title}</TooltipContent>
    </Tooltip>
  ));

  return (
    <div className="flex w-full flex-wrap items-center gap-2.5">
      {styleButtons}
      <div className="bg-border h-5 w-0.5" />
      {decoratorButtons}
    </div>
  );
}

export default TextEditor;
