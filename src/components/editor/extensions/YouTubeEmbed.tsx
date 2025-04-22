import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

// YouTube component to render the embed
const YouTubeComponent = ({ node }: { node: any }) => {
  const { src, width, height } = node.attrs;

  return (
    <NodeViewWrapper className="youtube-embed">
      <div
        className="relative"
        style={{ width: width || "100%", paddingBottom: "56.25%" }}
      >
        <iframe
          src={src}
          width={width || "560"}
          height={height || "315"}
          className="absolute top-0 left-0 w-full h-full border-0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </NodeViewWrapper>
  );
};

// Extract YouTube ID from various YouTube URL formats
export const getYoutubeEmbedUrl = (url: string): string | null => {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// The actual Tiptap extension
const YouTubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "315",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-embed]",
        getAttrs: (element) => {
          if (typeof element === "string") return {};
          const div = element as HTMLElement;
          const iframe = div.querySelector("iframe");
          return {
            src: iframe?.getAttribute("src"),
            width: iframe?.getAttribute("width"),
            height: iframe?.getAttribute("height"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-youtube-embed": "" }, ["iframe", HTMLAttributes]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeComponent);
  },
});

export default YouTubeEmbed;
