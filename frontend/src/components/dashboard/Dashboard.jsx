  import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { BarChart3, BookOpen, Brain, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import DeckManager from "./DeckManager";
import Analytics from "./Analytics";
import CreateContent from "./CreateContent";
import StudyQueue from "./StudyQueue";
import { StoreContext } from "../../context/StoreContext";
import {useLocation, useNavigate} from "react-router-dom"
import axios from "axios";

const Dashboard = () => {
  const { setIsAuthenticated, userName, decks, cardsCount, dueCardsFunc, dueCardsLength, cardsCountFunc, fetchDecks } =
    useContext(StoreContext);
  const navigate  = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split("/")[2] || "study";


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    dueCardsFunc();
    cardsCountFunc();
    fetchDecks()
  }, [cardsCount]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">  
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-indigo-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">StudySpace</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {userName}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Today</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dueCardsLength}</div>
                <p className="text-xs text-muted-foreground">Cards to review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cards
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardsCount} cards</div>
                <p className="text-xs text-muted-foreground">
                  Across {decks.length} decks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs
            value={currentTab}
            onValueChange={(val) => navigate(`/dashboard/${val}`)}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="study" className="cursor-pointer">
                Study
              </TabsTrigger>
              <TabsTrigger value="create" className="cursor-pointer">
                Create Cards
              </TabsTrigger>
              <TabsTrigger value="decks" className="cursor-pointer">
                My Decks
              </TabsTrigger>
              <TabsTrigger value="analytics" className="cursor-pointer">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study">
              <StudyQueue />
            </TabsContent>

            <TabsContent value="create">
              <CreateContent />
            </TabsContent>

            <TabsContent value="decks">
              <DeckManager />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
