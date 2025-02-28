"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/utils/supabase/api/profiles";
import { useRouter } from "next/navigation";
import { situation, SituationType } from "@/types/perfume";
import { SuggestionsPerfumes } from "@/types/profile";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Check, Heart, Coffee, Briefcase, Music, Activity, Ban } from "lucide-react";

function PerfumeQuiz() {
  const router = useRouter();
  
  // Quiz state
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SuggestionsPerfumes>({
    favoriteScent: "",
    customScent: "",
    favoriteBrand: "",
    customBrand: "",
    rating: 3,
    topNotes: "",
    customTopNotes: "",
    middleNotes: "",
    customMiddleNotes: "",
    baseNotes: "",
    customBaseNotes: "",
    situation: [] as string[],
    customSituation: "",
  });

  // Quiz questions
  const steps = [
    {
      title: "When do you wear fragrances?",
      description: "Let's start by understanding when you enjoy wearing perfume",
      field: "situation",
      component: "situation",
    },
    {
      title: "What type of scent speaks to you?",
      description: "Choose the fragrance family that resonates with your personality",
      field: "favoriteScent",
      component: "scent",
    },
    {
      title: "Which brand captures your essence?",
      description: "Select your favorite perfume house or brand",
      field: "favoriteBrand",
      component: "brand",
    },
    {
      title: "Let's talk about notes",
      description: "The building blocks of any great fragrance",
      field: "notes",
      component: "notes",
    },
    {
      title: "How intense do you like your fragrance?",
      description: "From subtle whispers to bold statements",
      field: "rating",
      component: "rating",
    },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSituationChange = (value: SituationType) => {
    setFormData({
      ...formData,
      situation: situation[value],
    });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({ ...formData, rating: value[0] });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    updateProfile({
      columns: "suggestions_perfumes",
      values: formData,
    });
    router.push("/perfumes/home");
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case "situation":
        return (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {Object.keys(situation).map((key) => (
              <Button
                key={key}
                variant={formData.situation === situation[key as SituationType] ? "default" : "outline"}
                className="h-32 flex flex-col items-center justify-center gap-2 transition-all"
                onClick={() => handleSituationChange(key as SituationType)}
              >
                {key === "daily" && <Coffee className="h-8 w-8" />}
                {key === "formal" && <Briefcase className="h-8 w-8" />}
                {key === "date" && <Heart className="h-8 w-8" />}
                {key === "party" && <Music className="h-8 w-8" />}
                {key === "exercise" && <Activity className="h-8 w-8" />}
                {key === "none" && <Ban className="h-8 w-8" />}
                <span className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </Button>
            ))}
          </div>
        );

      case "scent":
        return (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["floral", "woody", "oriental", "fresh", "citrus", "none"].map((scent) => (
                <Button
                  key={scent}
                  variant={formData.favoriteScent === scent ? "default" : "outline"}
                  className="h-24 relative overflow-hidden transition-all"
                  onClick={() => handleSelectChange("favoriteScent", scent)}
                >
                  <div className="absolute inset-0 opacity-10 bg-cover bg-center" 
                       style={{ backgroundImage: `url(/images/scents/${scent}.jpg)` }} />
                  <span>{scent.charAt(0).toUpperCase() + scent.slice(1)}</span>
                </Button>
              ))}
            </div>
            <Button
              variant={formData.favoriteScent === "other" ? "default" : "outline"}
              className="w-full"
              onClick={() => handleSelectChange("favoriteScent", "other")}
            >
              Other
            </Button>
            {formData.favoriteScent === "other" && (
              <Input
                name="customScent"
                placeholder="Tell us your favorite scent..."
                value={formData.customScent}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>
        );

      case "brand":
        return (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["chanel", "dior", "tomford", "ysl", "gucci", "none"].map((brand) => (
                <Button
                  key={brand}
                  variant={formData.favoriteBrand === brand ? "default" : "outline"}
                  className="h-24 flex items-center justify-center transition-all"
                  onClick={() => handleSelectChange("favoriteBrand", brand)}
                >
                  <span>{brand === "tomford" ? "Tom Ford" : 
                         brand === "ysl" ? "YSL" : 
                         brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </span>
                </Button>
              ))}
            </div>
            <Button
              variant={formData.favoriteBrand === "other" ? "default" : "outline"}
              className="w-full"
              onClick={() => handleSelectChange("favoriteBrand", "other")}
            >
              Other
            </Button>
            {formData.favoriteBrand === "other" && (
              <Input
                name="customBrand"
                placeholder="Tell us your favorite brand..."
                value={formData.customBrand}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="topNotes" className="text-lg font-medium">Top Notes</Label>
                <div className="text-sm text-muted-foreground">First impression (15-30 minutes)</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["citrus", "lavender", "bergamot", "mint", "none"].map((note) => (
                  <Button
                    key={note}
                    size="sm"
                    variant={formData.topNotes === note ? "default" : "outline"}
                    className="transition-all"
                    onClick={() => handleSelectChange("topNotes", note)}
                  >
                    {note.charAt(0).toUpperCase() + note.slice(1)}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant={formData.topNotes === "other" ? "default" : "outline"}
                onClick={() => handleSelectChange("topNotes", "other")}
              >
                Other
              </Button>
              {formData.topNotes === "other" && (
                <Input
                  name="customTopNotes"
                  placeholder="Custom top notes..."
                  value={formData.customTopNotes}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="middleNotes" className="text-lg font-medium">Heart Notes</Label>
                <div className="text-sm text-muted-foreground">The core (30min-2hrs)</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["rose", "jasmine", "ylangylang", "geranium", "none"].map((note) => (
                  <Button
                    key={note}
                    size="sm"
                    variant={formData.middleNotes === note ? "default" : "outline"}
                    className="transition-all"
                    onClick={() => handleSelectChange("middleNotes", note)}
                  >
                    {note === "ylangylang" ? "Ylang-Ylang" : note.charAt(0).toUpperCase() + note.slice(1)}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant={formData.middleNotes === "other" ? "default" : "outline"}
                onClick={() => handleSelectChange("middleNotes", "other")}
              >
                Other
              </Button>
              {formData.middleNotes === "other" && (
                <Input
                  name="customMiddleNotes"
                  placeholder="Custom middle notes..."
                  value={formData.customMiddleNotes}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="baseNotes" className="text-lg font-medium">Base Notes</Label>
                <div className="text-sm text-muted-foreground">The lasting impression (2hrs+)</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["vanilla", "musk", "sandalwood", "amber", "none"].map((note) => (
                  <Button
                    key={note}
                    size="sm"
                    variant={formData.baseNotes === note ? "default" : "outline"}
                    className="transition-all"
                    onClick={() => handleSelectChange("baseNotes", note)}
                  >
                    {note.charAt(0).toUpperCase() + note.slice(1)}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant={formData.baseNotes === "other" ? "default" : "outline"}
                onClick={() => handleSelectChange("baseNotes", "other")}
              >
                Other
              </Button>
              {formData.baseNotes === "other" && (
                <Input
                  name="customBaseNotes"
                  placeholder="Custom base notes..."
                  value={formData.customBaseNotes}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="space-y-8 mt-10">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="text-2xl font-medium">{formData.rating}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">Subtle</div>
                <Slider
                  defaultValue={[formData.rating]}
                  max={5}
                  min={1}
                  step={0.01}
                  className="flex-1"
                  onValueChange={handleSliderChange}
                />
                <div className="text-sm text-muted-foreground">Bold</div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <div className="text-center text-lg font-medium">Your Perfume Profile</div>
              <div className="text-center text-sm text-muted-foreground">
                Based on your selections, we'll recommend fragrances that match your style.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Find Your Signature Scent</CardTitle>
          <CardDescription>
            {currentStep + 1} of {totalSteps}: {steps[currentStep].title}
          </CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>

        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            {steps[currentStep].description}
          </p>
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Find My Fragrance <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default PerfumeQuiz;