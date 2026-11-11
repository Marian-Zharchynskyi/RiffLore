import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { MainMobileApp } from './src/screens/MainMobileApp';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <MainMobileApp />
    </>
  );
}
