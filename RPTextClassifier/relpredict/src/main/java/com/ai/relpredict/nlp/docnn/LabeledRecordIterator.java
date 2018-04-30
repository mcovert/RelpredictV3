package com.ai.relpredict.nlp.docnn;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.deeplearning4j.text.documentiterator.LabelAwareIterator;
import org.deeplearning4j.text.documentiterator.LabelledDocument;
import org.deeplearning4j.text.documentiterator.LabelsSource;

public class LabeledRecordIterator implements LabelAwareIterator {
    String         fileName;
    FileReader     fr;
    BufferedReader reader;
    LabelsSource   ls = new LabelsSource("DOC_");
	public LabeledRecordIterator(String fileName) throws FileNotFoundException {
		this.fileName = fileName;
		this.fr = new FileReader(fileName);
		this.reader = new BufferedReader(fr);
	}
	@Override
	public boolean hasNext() {
		try {
			return reader.ready();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public LabelledDocument next() {
		try {
			String[] tokens = reader.readLine().split("\t");
			LabelledDocument ld = new LabelledDocument();
			ld.addLabel(tokens[0]);
			ld.setContent(tokens[1]);
			return new LabelledDocument();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean hasNextDocument() {
		try {
			return reader.ready();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public LabelledDocument nextDocument() {
		return next();
	}

	@Override
	public void reset() {
		try {
			fr.close();
			this.fr = new FileReader(fileName);
			reader = new BufferedReader(fr);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public LabelsSource getLabelsSource() {
		return ls;
	}

	@Override
	public void shutdown() {
		try {
			fr.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
