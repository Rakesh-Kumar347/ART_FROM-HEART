"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Users, Smile, Shirt, Watch, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useOrderStore } from "@/store/order-store";
import { useComplexityAnalysis } from "@/hooks/useComplexityAnalysis";

const analysisSteps = [
  { key: "persons", label: "Detecting persons", icon: Users },
  { key: "faces", label: "Analyzing face details", icon: Smile },
  { key: "clothing", label: "Evaluating clothing complexity", icon: Shirt },
  { key: "accessories", label: "Identifying accessories", icon: Watch },
];

export default function ComplexityAnalyzer() {
  const { imageFile, complexityResult, setComplexityResult, nextStep, prevStep } = useOrderStore();
  const { analyze, result, isAnalyzing, progress, error } = useComplexityAnalysis();

  useEffect(() => {
    if (imageFile && !complexityResult && !isAnalyzing) {
      analyze(imageFile);
    }
  }, [imageFile, complexityResult, isAnalyzing, analyze]);

  useEffect(() => {
    if (result) setComplexityResult(result);
  }, [result, setComplexityResult]);

  const scoreColor = (score: number) => {
    if (score <= 3) return "text-green-400";
    if (score <= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-dark-50">AI Analysis</h2>
        <p className="text-dark-400 mt-2">Our AI is analyzing your image to determine sketch complexity</p>
      </div>

      {isAnalyzing && (
        <Card className="max-w-lg mx-auto">
          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const progressPercent = progress.percent;
              const stepStart = (index / analysisSteps.length) * 100;
              const stepEnd = ((index + 1) / analysisSteps.length) * 100;
              const isActive = progressPercent >= stepStart && progressPercent < stepEnd;
              const isComplete = progressPercent >= stepEnd;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? "bg-green-500/20" : isActive ? "bg-primary-400/20" : "bg-dark-800"}`}>
                    {isComplete ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Icon className={`h-4 w-4 ${isActive ? "text-primary-400" : "text-dark-500"}`} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isActive ? "text-dark-50" : isComplete ? "text-dark-300" : "text-dark-500"}`}>{step.label}</p>
                    {isActive && (
                      <div className="h-1 w-full bg-dark-800 rounded-full mt-1 overflow-hidden">
                        <motion.div className="h-full bg-primary-400 rounded-full" animate={{ width: "70%" }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-dark-800">
            <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary-400 rounded-full" animate={{ width: `${progress.percent}%` }} />
            </div>
            <p className="text-xs text-dark-400 mt-2 text-center">{progress.step || "Initializing..."}</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="max-w-lg mx-auto text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={prevStep}>Go Back</Button>
            <Button onClick={() => imageFile && analyze(imageFile)}>Retry Analysis</Button>
          </div>
        </Card>
      )}

      {complexityResult && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">
          <Card className="text-center">
            <div className="mb-4">
              <Brain className="h-10 w-10 text-primary-400 mx-auto mb-2" />
              <p className="text-sm text-dark-400">Overall Complexity Score</p>
              <p className={`text-5xl font-serif font-bold mt-1 ${scoreColor(complexityResult.overallScore)}`}>
                {complexityResult.overallScore.toFixed(1)}
              </p>
              <p className="text-xs text-dark-500 mt-1">out of 10</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "Persons", value: complexityResult.personCount, icon: Users },
                { label: "Face Detail", value: complexityResult.faceDetailScore.toFixed(1), icon: Smile },
                { label: "Clothing", value: complexityResult.clothingScore.toFixed(1), icon: Shirt },
                { label: "Accessories", value: complexityResult.accessoryScore.toFixed(1), icon: Watch },
              ].map((item) => (
                <div key={item.label} className="bg-dark-800/50 rounded-lg p-3">
                  <item.icon className="h-4 w-4 text-primary-400 mx-auto mb-1" />
                  <p className="text-xs text-dark-400">{item.label}</p>
                  <p className="text-lg font-bold text-dark-50">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={prevStep}>Go Back</Button>
            <Button onClick={nextStep}>Continue to Customize</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
