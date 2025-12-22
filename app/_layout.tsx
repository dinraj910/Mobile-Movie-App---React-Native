import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1A1A2E" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0D253F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#1A1A2E',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}
