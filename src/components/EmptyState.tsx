import { Button } from "@/components/ui/button";

export const EmptyState = () => {
  const suggestions = [
    "📝 Summarize text",
    "💡 Brainstorm",
    "📝 Make a plan",
    "📊 Analyze data",
    "💻 Code",
    "More",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="text-center max-w-2xl w-full">
        <h2 className="text-2xl font-normal text-chatgpt-gray-900 mb-12">
          What are you working on?
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto">
          {suggestions.map((item, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="h-12 text-left text-chatgpt-gray-700 border-chatgpt-gray-200 hover:bg-chatgpt-gray-50 transition-colors rounded-xl bg-chatgpt-white flex items-center justify-start px-4"
            >
              <span className="mr-3">{item.split(" ")[0]}</span>
              <span className="text-sm">
                {item.split(" ").slice(1).join(" ")}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
