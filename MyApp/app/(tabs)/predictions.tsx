import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { buildApiUrl } from '@/constants/api';

interface Fixture {
  title: string;
  date: string;
}

interface Prediction {
  odds: string;
  predictedScore: string;
  analysis: string;
}

const PredictionCard = ({ title, prediction }: { title: string; prediction: Prediction | null }) => (
  <ThemedView style={styles.card}>
    <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
    {prediction ? (
      <View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Odds:</ThemedText>
          <ThemedText style={styles.value}>{prediction.odds}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Predicted Score:</ThemedText>
          <ThemedText style={styles.value}>{prediction.predictedScore}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Analysis:</ThemedText>
          <ThemedText style={styles.value}>{prediction.analysis}</ThemedText>
        </View>
      </View>
    ) : (
      <ActivityIndicator />
    )}
  </ThemedView>
);

export default function PredictionsScreen() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixturesAndPredictions = async () => {
      setError(null);
      try {
        const fixturesResponse = await fetch(buildApiUrl('/api/fixtures'));
        if (!fixturesResponse.ok) {
          throw new Error(`Fixtures request failed with status ${fixturesResponse.status}`);
        }

        const fixturesData = await fixturesResponse.json();

        if (!Array.isArray(fixturesData)) {
          throw new Error('Unexpected fixtures response format.');
        }

        setFixtures(fixturesData);

        if (fixturesData.length === 0) {
          setPredictions({});
          return;
        }

        const predictionPromises = fixturesData.map(async (fixture: Fixture) => {
          const predictionResponse = await fetch(buildApiUrl('/api/predict'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: fixture.title }),
          });
          if (!predictionResponse.ok) {
            throw new Error(`Prediction request failed for ${fixture.title}`);
          }
          const predictionData = await predictionResponse.json();
          return { [fixture.title]: predictionData };
        });

        const resolvedPredictions = await Promise.all(predictionPromises);
        const predictionsMap = resolvedPredictions.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setPredictions(predictionsMap);

      } catch (error) {
        console.error('Failed to fetch predictions data:', error);
        setError('Unable to load predictions right now. Please try again later.');
        setFixtures([]);
        setPredictions({});
      } finally {
        setLoading(false);
      }
    };

    fetchFixturesAndPredictions();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading upcoming matches...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>AI Predictions</ThemedText>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.header}>AI Predictions (Next 24 Hours)</ThemedText>
      {fixtures.length === 0 ? (
        <ThemedText>No fixtures scheduled in the next 24 hours.</ThemedText>
      ) : (
        fixtures.map(fixture => (
          <PredictionCard key={fixture.title} title={fixture.title} prediction={predictions[fixture.title] || null} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});
