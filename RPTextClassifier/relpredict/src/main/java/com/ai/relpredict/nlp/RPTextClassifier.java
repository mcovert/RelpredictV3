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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

public class RPTextClassifier {

    ParagraphVectors paragraphVectors;
    LabelAwareIterator iterator;
    TokenizerFactory tokenizerFactory;

    private static final Logger log = LoggerFactory.getLogger(RPTextClassifier.class);

    public static void main(String[] args) throws Exception {

      RPTextClassifier app = new RPTextClassifier();
      app.makeParagraphVectors("/home/mcovert/nlp/labeled");
      app.checkUnlabeledData("/home/mcovert/nlp/unlabeled");
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
              .batchSize(5000)
              .epochs(10)
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
     while (unClassifiedIterator.hasNextDocument()) {
         LabelledDocument document = unClassifiedIterator.nextDocument();
         INDArray documentAsCentroid = meansBuilder.documentAsVector(document);
         List<Pair<String, Double>> scores = seeker.getScores(documentAsCentroid);

         /*
          please note, document.getLabel() is used just to show which document we're looking at now,
          as a substitute for printing out the whole document name.
          So, labels on these two documents are used like titles,
          just to visualize our classification done properly
         */
         System.out.println("Document '" + document.getLabels() + "' falls into the following categories: ");
         for (Pair<String, Double> score: scores) {
             System.out.println("        " + score.getFirst() + ": " + score.getSecond());
         }
     }

    }
}

