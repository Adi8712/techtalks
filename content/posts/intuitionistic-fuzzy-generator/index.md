+++
title = 'Intuitionistic Fuzzy Generator'
date = '2026-01-18T02:56:40+05:30'
tags = [ "fuzzy" ]
description = ""
draft = false
math = true
image = "images/ifg.png"
+++

>> I took a course on Fuzzy Logic in my 7th semester. This is going to be a mix of my understanding of the course and the paper which I presented as the project work in the course.

### Is the temperature around you hot or cold?  
At the time of writing this, I'll answer that it's almost cold. But what determines that it's "almost"? Obviously our senses and perhaps our mood but beyond that what's the reasoning?

This is the idea of **Fuzzy** - the inability to classify something absolutely, it's the opposite of the traditional boolean logic where we are sure that the answer is either yes or no. Fuzzy Systems are the best way to model real-world scenarios, since we encounter lots of maybe situations.

The way to measure such belongingness to a certain attribute is done by membership functions. They help us associate a mathematical model to such attributes and whose values lie between 0 to 1, where intermediary values indicate cases like "almost", "very", "very much", "slightly", etc.
> The adjectives above are actually called linguistic variables and are useful when working with Fuzzy Rules.

### Fuzzy Systems
Let's have a look at how fuzzy systems work:

1. Fuzzification - converting a crisp set into fuzzy set using membership function
2. Fuzzy Rules - IF-THEN rules
3. Inference Engine - using the Fuzzy Rules to convert the fuzzy input to fuzzy output
4. Defuzzification - converting the fuzzy output to desired output using methods like center of area(COA), center of gravity(COG), etc.

{{< figure src="images/fis.svg" title="Fuzzy Inference System">}}

### Paper
The paper intends to utilise an Intuitionistic Fuzzy Generator(IFG) to create Intuitionistic Fuzzy Image(IFI) and enhance it's contrast using the existing CLAHE technique. The key is to create an IFI with the maximum entropy, as it'll have the maximum amount of details. This is unique for every image and not dependent on any fixed variable.

The paper claims that since this method is applied only on the V channel of the HSV color space of an image, there is no direct change being made to the visible RGB values. Therefore, all changes in the final image should be due to contrast enhancement and not due to color grading changes.

#### Why IFG?
Intuitionistic Fuzzy Set extends Fuzzy Set to include the non-membership property.

1. Membership value(\(\mu\)) - degree of belonging
2. Non-Membership value(\(\nu\)) - degree of non-belonging
3. $$ \mu_A(x) + \nu_A(x) \le 1 $$
4. Hesitancy(\(\pi\)) - degree of uncertainity $$ \pi_A(x) = 1 - \mu_A(x) - \nu_A(x) $$ 

Using these together we can come up with a practical representation for an image denoting the contrast values of each pixel, which is referred to as Intuitionistic Fuzzy Image(IFI).

#### Proposed IFG
After solving extensive formulae, we arrive at these final forms:
1. Membership value(\(\mu\)) $$ \mu_{ij} = \frac{[ 1 +  (k + 1)^{2} ] \mu_{ij}}{1 + \mu_{ij} (k + 1)^{2}} $$
2. Non-Membership value(\(\nu\)) $$ \nu_{ij} = \frac{1 - \mu_{ij}}{1 + \mu_{ij} (k + 1)^{2}[ 2 +  (k + 1)^{2} ]} $$
3. Hesitancy(\(\pi\)) $$ \pi_{ij} = 1 - \mu_{ij} - \nu_{ij} $$

#### The Process
1. Represent the entire image as a fuzzy image \(F\)
2. Vary \(k\) values from 0 to 1 and create multiple IFI \(H\)
3. Identify the IFI that has the highest entropy value, thereby maximising the amount of information present \(H_{max}\)
4. Apply CLAHE on \(H_{max}\) to get an enhanced IFI \(H_{new}\)
5. Defuzzify \(H_{new}\) to get enhanced image \(E\)

### Takeaway
In majority samples, the best \(k\) value was 0, hinting that for the proposed method of IFI creation, the \(k\) value has to be low in order to maximise \(entropy\)

I confirmed this by plotting a boxplot of \(entropy\) vs \(k\) for my sample dataset consisting of 485 images, and although the curvature is minimal, it can still be seen that for the proposed IFG, higher values of \(k\) result in decreasing \(entropy\)

{{< figure src="images/ifg.png" title="Boxplot">}}

The paper builds on the authors' previous works and proposes an IFG to generate mutliple IFI for all possible values of the parameter \(k\), and implementing CLAHE on the IFI having maximum entropy.

### References
1. [A novel intuitionistic fuzzy generator for low-contrast color image enhancement technique](https://doi.org/10.1016/j.inffus.2024.102365)
> Selvam, C., Jebadass, R.J.J., Sundaram, D., & Shanmugam, L.
2. [Implementation](https://github.com/Adi8712/IFGContrastEnhancer)
> Mistakes are mine