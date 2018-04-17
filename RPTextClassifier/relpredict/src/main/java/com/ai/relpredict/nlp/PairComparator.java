package com.ai.relpredict.nlp;

import java.util.Comparator;

import org.nd4j.linalg.primitives.Pair;

public class PairComparator implements Comparator<Pair<String, Double>>
{
    // Used for sorting in ascending order of
    // roll number
    public int compare(Pair<String, Double> a, Pair<String, Double> b)
    {
        double diff = a.getSecond() - b.getSecond();
        if (diff > 0.0) return -1; // Descending sort
        if (diff == 0.0) return 0;
        return 1;
    }
}
