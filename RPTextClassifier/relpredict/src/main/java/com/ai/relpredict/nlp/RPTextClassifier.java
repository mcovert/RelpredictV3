package com.ai.relpredict.nlp;

import org.nd4j.linalg.primitives.Pair;
import com.ai.relpredict.nlp.LabelSeeker;
import com.ai.relpredict.nlp.MeansBuilder;

import org.deeplearning4j.models.embeddings.inmemory.InMemoryLookupTable;
import org.deeplearning4j.models.paragraphvectors.ParagraphVectors;
import org.deeplearning4j.models.word2vec.VocabWord;
import org.deeplearning4j.text.documentiterator.FileLabelAwareIterator;
import org.deeplearning4j.text.documentiterator.LabelAwareIterator;
import org.deeplearning4j.text.documentiterator.LabelledDocument;
import org.deeplearning4j.text.tokenization.tokenizer.preprocessor.CommonPreprocessor;
import org.deeplearning4j.text.tokenization.tokenizerfactory.DefaultTokenizerFactory;
import org.deeplearning4j.text.tokenization.tokenizerfactory.TokenizerFactory;
import org.nd4j.linalg.api.ndarray.INDArray;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.List;

public class RPTextClassifier {

    ParagraphVectors paragraphVectors;
    LabelAwareIterator iterator;
    TokenizerFactory tokenizerFactory;
    int topMatch = 10;

    public static void main(String[] args) throws Exception {
      System.out.println("Labeled data: " + args[0] + "\nUnlabeled data: " + args[1]);
      int num = 10;
      if (args.length == 3) num  = Integer.parseInt(args[2]);
      RPTextClassifier app = new RPTextClassifier(num);
      app.makeParagraphVectors(args[0]);
      app.checkUnlabeledData(args[1]);
    }
    public RPTextClassifier(int num) {
    	topMatch = num;
    }

    void makeParagraphVectors(String fileName)  throws Exception {
        File labeledData = new File(fileName);

        // Build iterator for dataset
        iterator = new FileLabelAwareIterator.Builder()
                .addSourceFolder(labeledData)
                .build();

      tokenizerFactory = new DefaultTokenizerFactory();
      tokenizerFactory.setTokenPreProcessor(new CommonPreprocessor());

      // ParagraphVectors training configuration
      paragraphVectors = new ParagraphVectors.Builder()
              .learningRate(0.025)
              .minLearningRate(0.001)
              .batchSize(10000)
              .epochs(50)
              .iterate(iterator)
              .trainWordVectors(true)
              .tokenizerFactory(tokenizerFactory)
              .build();

      // Start model training
      System.out.println("Fitting data...");
      paragraphVectors.fit();
    }

    void checkUnlabeledData(String fileName) throws FileNotFoundException {
       /*
        At this point we assume that we have model built and we can check
        which categories our unlabeled document falls into.
        So we'll start loading our unlabeled documents and checking them
       */
       File unlabeledData = new File(fileName);
       FileLabelAwareIterator unClassifiedIterator = new FileLabelAwareIterator.Builder()
               .addSourceFolder(unlabeledData)
               .build();
     /*
      Now we'll iterate over unlabeled data, and check which label it could be assigned to
      Please note: for many domains it's normal to have 1 document fall into few labels at once,
      with different "weight" for each.
     */
     MeansBuilder meansBuilder = new MeansBuilder(
             (InMemoryLookupTable<VocabWord>)paragraphVectors.getLookupTable(),
               tokenizerFactory);
         LabelSeeker seeker = new LabelSeeker(iterator.getLabelsSource().getLabels(),
             (InMemoryLookupTable<VocabWord>) paragraphVectors.getLookupTable());
     System.out.println("Results...");
     PairComparator pComp = new PairComparator();
     double docCount = 0;
     double correct = 0;
     double correct2 = 0;
     double correct3 = 0;
     double correct4 = 0;     
     double correct5 = 0;
     while (unClassifiedIterator.hasNextDocument()) {
    	 docCount += 1.0;
         LabelledDocument document = unClassifiedIterator.nextDocument();
         INDArray documentAsCentroid = meansBuilder.documentAsVector(document);
         List<Pair<String, Double>> scores = seeker.getScores(documentAsCentroid);
         String label = document.getLabels().get(0);
         /*
          please note, document.getLabel() is used just to show which document we're looking at now,
          as a substitute for printing out the whole document name.
          So, labels on these two documents are used like titles,
          just to visualize our classification done properly
         */
         //System.out.println("Document '" + document.getLabels() + "' falls into the following categories: ");
         Collections.sort(scores, pComp);
         int i = 0;
         for (Pair<String, Double> score: scores) {
        	 if (i == 0 && score.getFirst().equals(label)) { 
        		 correct += 1.0; correct2 += 1.0; correct3 += 1.0; correct4 += 1.0; correct5 += 1.0; 
             }
        	 if (i == 1 && score.getFirst().equals(label)) { 
        		 correct2 += 1.0; correct3 += 1.0; correct4 += 1.0; correct5 += 1.0; 
        	 }
        	 if (i == 2 && score.getFirst().equals(label)) { 
        		 correct3 += 1.0; correct4 += 1.0; correct5 += 1.0; 
        	 }
        	 if (i == 3 && score.getFirst().equals(label)) { 
        		 correct4 += 1.0; correct5 += 1.0; 
        	 }
        	 if (i == 4 && score.getFirst().equals(label)) { 
        		 correct5 += 1.0; 
        	 }
             System.out.println(label + "\t" + score.getFirst() + "\t" + score.getSecond());
             i++;
             if (i >= topMatch) break;
         }
         System.out.println("\nDocuments: " + docCount );
         System.out.println("Correct:   " + correct );
         System.out.println("Match Accuracy:  " + correct / docCount );
         System.out.println("Top 2 Accuracy:  " + correct2 / docCount );
         System.out.println("Top 3 Accuracy:  " + correct3 / docCount );
         System.out.println("Top 4 Accuracy:  " + correct4 / docCount );
         System.out.println("Top 5 Accuracy:  " + correct5 / docCount );
     }

    }
}

