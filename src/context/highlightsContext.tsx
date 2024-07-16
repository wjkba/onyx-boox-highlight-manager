import { createContext, ReactNode, useContext, useState } from "react";

interface Highlight {
  quote: string;
  bookTitle: string;
  bookAuthor: string;
}

interface HighlightsContextType {
  highlights: Highlight[];
  setHighlights: (highlights: Highlight[]) => void;
}

interface HighlightsContextProviderProps {
  children: ReactNode;
}

const HighlightsContext = createContext<HighlightsContextType | null>(null);

const HighlightsProvider = ({ children }: HighlightsContextProviderProps) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  return (
    <HighlightsContext.Provider value={{ highlights, setHighlights }}>
      {children}
    </HighlightsContext.Provider>
  );
};

export const useHighlights = (): HighlightsContextType => {
  const context = useContext(HighlightsContext);
  if (context === null) {
    throw new Error("useHighlights must be used within a HighlightsProvider");
  }
  return context;
};

export default HighlightsProvider;
