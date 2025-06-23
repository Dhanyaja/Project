import React, { useContext, useState } from "react";
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Dashboard from "../dashboard/Dashboard";
import AuthModal from "../auth/AuthModal";
import { StoreContext } from "../../context/StoreContext";

const LandingPage = ({ onShowAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">StudySpace</h1>
            </div>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={onShowAuth}
                className="cursor-pointer"
              >
                Sign In
              </Button>
              <Button onClick={onShowAuth} className="cursor-pointer">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Master Any Subject with
            <span className="text-indigo-600"> Smart Repetition</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Harness the power of spaced repetition to learn faster and remember
            longer. Our scientifically-proven system adapts to your learning
            pace.
          </p>
          <Button
            size="lg"
            onClick={onShowAuth}
            className="text-lg px-8 py-3 cursor-pointer"
          >
            Start Learning Today
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why StudySpace Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our algorithm schedules reviews at the optimal time based on
                  your performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Detailed analytics show your learning progress and identify
                  areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Share Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create personalized study decks to boost your learning
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">StudySpace</span>
          </div>
          <p className="text-gray-400">
            Empowering learners worldwide with intelligent spaced repetition.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
