package com.ai.relpredict.nlp.docnn;

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

public class TextClassifier {

	public static void main(String[] args) {
		String inDataFile = args[0];
		System.out.println("Training file is " + inDataFile);
		

	}

}
