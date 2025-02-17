import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../common/Header';  
import Footer from '../common/Footer';  
import GrowComponents from './GrowComponents';
import GrowData from './GrowData';

const Zone: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('ZONE 1');
  const [isEnabled, setIsEnabled] = useState<boolean[]>([false, false, false, false]);

  const toggleStatus = (index: number) => {
    setIsEnabled((prevState) => {
      const newStates = [...prevState]; 
      newStates[index] = !newStates[index]; 
      return newStates;
    });
  };

  return (
    <View style={styles.container}>
      <Header selectedZone={selectedZone} setSelectedZone={setSelectedZone} viewZone={true} />

      <View style={styles.content}>
        <GrowComponents isEnabled={isEnabled} toggleStatus={toggleStatus} />
        <GrowData />
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04261C', 
  },
  content: {
    marginTop: '29%',  
  },
});

export default Zone;

