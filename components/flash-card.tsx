import { FlashCard as FlashCardSchema } from "@/lib/schemas";
import { useState } from "react";
import ReactCardFlip from 'react-card-flip';
import { Card, CardContent } from "./ui/card";

const FlashCard: React.FC<{
  question: FlashCardSchema;
}> = ({ question }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-6">
      <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
        <Card className="min-h-[400px] p-8 items-center flex justify-center" onClick={() => setFlipped(!flipped)}>
          <CardContent className="p-0 m-0">
            Q. {question.question}
          </CardContent>
        </Card>

        <Card className="min-h-[400px] p-8 items-center flex justify-center" onClick={() => setFlipped(!flipped)}>
          <CardContent className="p-0 m-0">
            A. {question.answer}
          </CardContent>
        </Card>
      </ReactCardFlip>
    </div>
  );
};

export default FlashCard;