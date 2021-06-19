const RFClassifier = require("ml-random-forest/src/RandomForestClassifier");
//import { RandomForestClassifier as RFClassifier } from 'ml-random-forest';


const dataset = [
  [0,1,0,1],
  [0,0,0,0],
  [1,1,1,1],
  [0,2,3,1],
  [0,1,0,0],
  [0,0,1,0]
];
 
const trainingSet = new Array(dataset.length);
const predictions = new Array(dataset.length);
 
for (let i = 0; i < dataset.length; ++i) {
  trainingSet[i] = dataset[i].slice(0, 3);
  predictions[i] = dataset[i][3];
}
//const trainingSet = [[0,2,3],[1,3,2],[0,2,4]];
//const predictions = [0,1,0];

const options = {
  seed: 3,
  maxFeatures: 0.8,
  replacement: true,
  nEstimators: 25
};

const classifier = new RFClassifier(options);
classifier.train(trainingSet, predictions);
const result = classifier.predict(trainingSet);
//const oobResult = classifier.predictOOB();
const confusionMatrix = classifier.getConfusionMatrix();
console.log(result);
//console.log(oobResult);
console.log(confusionMatrix);


