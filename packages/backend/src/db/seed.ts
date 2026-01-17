import { db } from './index';
import { passages, questions, answerChoices } from './schema';

const samplePassages = [
  {
    title: 'The Evolution of Jazz Music',
    category: 'Humanities',
    difficulty: 'Medium',
    estimatedTime: 540,
    content: `Jazz music emerged in the early 20th century in New Orleans, Louisiana, as a unique fusion of African and European musical traditions. The genre developed from a complex mixture of blues, ragtime, and European harmony, creating something entirely new and distinctly American. Unlike classical music, which relied heavily on written scores and formal structure, jazz emphasized improvisation and individual expression.

The early pioneers of jazz, including Louis Armstrong and Jelly Roll Morton, transformed music by introducing the concept of the soloist as a central figure. In traditional orchestras, musicians followed the conductor's interpretation of a composer's written score. Jazz musicians, however, viewed the written melody as merely a starting point for creative exploration. During performances, they would "take turns" improvising solos while other band members provided rhythmic and harmonic support.

This emphasis on improvisation reflected deeper cultural values. For many African American musicians, jazz represented freedom and self-expression in a society that often denied them both. The music's unpredictable nature—the fact that no two performances were exactly alike—embodied a resistance to conformity and standardization. Jazz became not just a musical genre, but a cultural movement that challenged existing social hierarchies.

By the 1920s, jazz had spread beyond New Orleans to Chicago, New York, and other urban centers. This migration coincided with the Great Migration of African Americans from the rural South to northern cities. As jazz evolved, it absorbed influences from various regional styles and urban experiences, becoming increasingly sophisticated in its harmonic and rhythmic complexity.

Critics of jazz often condemned it as chaotic or primitive, revealing their own cultural biases. However, musicians and scholars who took the time to study jazz recognized its technical sophistication. The ability to improvise coherently while maintaining harmonic structure and rhythmic integrity requires extensive musical knowledge and skill. Far from being primitive, jazz represents one of humanity's most intellectually demanding art forms.`,
    questions: [
      {
        questionNumber: 1,
        questionText: 'According to the passage, how did early jazz differ from classical music?',
        choices: [
          {
            letter: 'A',
            text: 'Jazz used more instruments than classical music.',
            isCorrect: false,
            explanation: 'The passage does not discuss the number of instruments used in jazz versus classical music. This is not mentioned as a distinguishing feature.',
          },
          {
            letter: 'B',
            text: 'Jazz emphasized improvisation rather than strict adherence to written scores.',
            isCorrect: true,
            explanation: 'This is correct. The passage explicitly states that "Unlike classical music, which relied heavily on written scores and formal structure, jazz emphasized improvisation and individual expression."',
          },
          {
            letter: 'C',
            text: 'Jazz was performed exclusively in New Orleans.',
            isCorrect: false,
            explanation: 'While jazz originated in New Orleans, the passage later describes how it spread to Chicago, New York, and other cities by the 1920s.',
          },
          {
            letter: 'D',
            text: 'Jazz musicians received more formal training than classical musicians.',
            isCorrect: false,
            explanation: 'The passage does not compare the formal training levels between jazz and classical musicians.',
          },
        ],
      },
      {
        questionNumber: 2,
        questionText: 'The author suggests that jazz improvisation represented:',
        choices: [
          {
            letter: 'A',
            text: 'A lack of musical training among early jazz musicians.',
            isCorrect: false,
            explanation: 'This contradicts the passage, which argues that improvisation requires "extensive musical knowledge and skill" and describes jazz as "intellectually demanding."',
          },
          {
            letter: 'B',
            text: 'An attempt to imitate European classical traditions.',
            isCorrect: false,
            explanation: 'The passage describes jazz as emphasizing improvisation and individual expression, contrasting it with European classical traditions rather than imitating them.',
          },
          {
            letter: 'C',
            text: 'A form of cultural resistance and self-expression.',
            isCorrect: true,
            explanation: 'Correct. The passage states that for African American musicians, "jazz represented freedom and self-expression in a society that often denied them both" and that its unpredictability "embodied a resistance to conformity."',
          },
          {
            letter: 'D',
            text: 'A temporary phase in jazz development.',
            isCorrect: false,
            explanation: 'The passage presents improvisation as a central and defining characteristic of jazz, not a temporary phase.',
          },
        ],
      },
      {
        questionNumber: 3,
        questionText: 'Based on the passage, critics who called jazz "primitive" likely:',
        choices: [
          {
            letter: 'A',
            text: 'Had carefully studied the technical aspects of jazz music.',
            isCorrect: false,
            explanation: 'The passage contrasts critics who "condemned it as chaotic or primitive" with "musicians and scholars who took the time to study jazz," implying the critics had not studied it carefully.',
          },
          {
            letter: 'B',
            text: 'Were responding to jazz\'s technical simplicity.',
            isCorrect: false,
            explanation: 'The passage argues that jazz is technically sophisticated and "intellectually demanding," not simple.',
          },
          {
            letter: 'C',
            text: 'Held cultural biases that prevented them from appreciating jazz.',
            isCorrect: true,
            explanation: 'Correct. The passage explicitly states that critics "condemned it as chaotic or primitive, revealing their own cultural biases."',
          },
          {
            letter: 'D',
            text: 'Preferred jazz to classical music.',
            isCorrect: false,
            explanation: 'Critics who called jazz "primitive" were condemning it, not preferring it to other forms of music.',
          },
        ],
      },
    ],
  },
  {
    title: 'The Placebo Effect in Medicine',
    category: 'Social Sciences',
    difficulty: 'Hard',
    estimatedTime: 600,
    content: `The placebo effect—the phenomenon where patients experience real improvements in their condition after receiving an inactive treatment—challenges fundamental assumptions about the relationship between mind and body in medical treatment. For decades, scientists dismissed placebo responses as mere psychological tricks or measurement errors. However, recent neuroscientific research has revealed that placebos can trigger measurable biological changes in the brain and body, forcing a reconsideration of what constitutes "real" medical treatment.

In randomized controlled trials, the gold standard for testing medical interventions, researchers typically divide participants into groups receiving either the experimental treatment or a placebo. The placebo group often shows surprising improvements, sometimes nearly matching the effects of the active treatment. In studies of pain management, for instance, placebo treatments have been shown to activate the brain's endogenous opioid system, releasing natural pain-relieving chemicals. Brain imaging studies demonstrate that regions associated with pain perception show reduced activity in patients receiving placebos, indicating that the effect is not simply imagined but involves actual neurological changes.

The magnitude of the placebo effect varies significantly depending on the condition being treated and the context of treatment. It tends to be stronger for subjective symptoms like pain, fatigue, and depression than for objective measures like tumor size or blood pressure. However, even some objective physiological markers can be influenced by placebo treatments. The ritual and context of medical care—the doctor's white coat, the clinical setting, the act of taking a pill—all contribute to the placebo response.

This raises profound ethical and practical questions for medical practice. If placebos can produce real therapeutic benefits, should doctors prescribe them? Traditional medical ethics requires informed consent, meaning patients must understand what treatment they are receiving. But placebos may lose their effectiveness if patients know they are taking an inactive substance. Some physicians have attempted to navigate this dilemma through "open-label" placebos, explicitly telling patients they are receiving an inactive treatment while explaining the placebo effect. Surprisingly, research suggests that even when patients know they are taking placebos, they may still experience benefits.

The placebo phenomenon also complicates the approval process for new medications. Pharmaceutical companies must demonstrate that their drugs work better than placebo treatments, but this becomes challenging when placebo responses are strong. Some researchers argue that the increasing placebo effect in clinical trials—possibly due to changing patient expectations or trial designs—has made it harder to prove drug efficacy. This has led to failed trials for medications that might actually be beneficial but cannot demonstrate sufficient superiority over placebo.`,
    questions: [
      {
        questionNumber: 1,
        questionText: 'The passage suggests that early scientific understanding of the placebo effect was limited because scientists:',
        choices: [
          {
            letter: 'A',
            text: 'Lacked the technology to measure neurological changes.',
            isCorrect: true,
            explanation: 'Correct. The passage indicates that "recent neuroscientific research" and "brain imaging studies" have revealed the biological basis of placebos, implying earlier scientists lacked these tools.',
          },
          {
            letter: 'B',
            text: 'Focused exclusively on psychological rather than physical symptoms.',
            isCorrect: false,
            explanation: 'The passage doesn\'t suggest this limitation. It mentions that scientists "dismissed placebo responses as mere psychological tricks," but doesn\'t say they only studied psychological symptoms.',
          },
          {
            letter: 'C',
            text: 'Refused to conduct randomized controlled trials.',
            isCorrect: false,
            explanation: 'The passage actually describes randomized controlled trials as the "gold standard" and discusses placebo groups within these trials.',
          },
          {
            letter: 'D',
            text: 'Believed all medical improvements required active pharmaceutical ingredients.',
            isCorrect: false,
            explanation: 'While this might be implied, it\'s not the primary limitation discussed in the passage.',
          },
        ],
      },
      {
        questionNumber: 2,
        questionText: 'According to the passage, open-label placebos are significant because they:',
        choices: [
          {
            letter: 'A',
            text: 'Produce stronger effects than traditional placebos.',
            isCorrect: false,
            explanation: 'The passage doesn\'t claim open-label placebos are stronger, only that they may still be effective despite patients knowing they\'re inactive.',
          },
          {
            letter: 'B',
            text: 'Resolve the ethical dilemma of informed consent.',
            isCorrect: true,
            explanation: 'Correct. The passage states that open-label placebos help "navigate this dilemma" of needing informed consent while using placebos, as patients are told what they\'re receiving.',
          },
          {
            letter: 'C',
            text: 'Work only for subjective symptoms like pain.',
            isCorrect: false,
            explanation: 'The passage doesn\'t specify that open-label placebos only work for subjective symptoms.',
          },
          {
            letter: 'D',
            text: 'Have replaced traditional placebos in clinical trials.',
            isCorrect: false,
            explanation: 'The passage doesn\'t suggest open-label placebos have replaced traditional placebos in trials.',
          },
        ],
      },
      {
        questionNumber: 3,
        questionText: 'The author implies that the increasing placebo effect in clinical trials:',
        choices: [
          {
            letter: 'A',
            text: 'Proves that modern medications are less effective than older ones.',
            isCorrect: false,
            explanation: 'The passage doesn\'t compare modern and older medication effectiveness.',
          },
          {
            letter: 'B',
            text: 'Results entirely from better trial methodologies.',
            isCorrect: false,
            explanation: 'The passage mentions "changing patient expectations or trial designs" as possible causes, not better methodologies.',
          },
          {
            letter: 'C',
            text: 'May cause potentially beneficial drugs to fail approval.',
            isCorrect: true,
            explanation: 'Correct. The passage explicitly states this has "led to failed trials for medications that might actually be beneficial but cannot demonstrate sufficient superiority over placebo."',
          },
          {
            letter: 'D',
            text: 'Should lead to the elimination of placebo-controlled trials.',
            isCorrect: false,
            explanation: 'The passage presents this as a challenge but doesn\'t advocate for eliminating placebo-controlled trials.',
          },
        ],
      },
    ],
  },
  {
    title: 'Urban Planning and Public Spaces',
    category: 'Social Sciences',
    difficulty: 'Easy',
    estimatedTime: 480,
    content: `Public spaces in cities serve functions that extend far beyond their practical purposes. Parks, plazas, and pedestrian areas are not merely aesthetic additions to urban landscapes; they are essential components of civic life that facilitate social interaction, democratic participation, and community building. The design and availability of these spaces reflect and shape the values of urban societies.

Throughout history, public squares have served as gathering places where citizens could meet, exchange ideas, and participate in collective activities. The ancient Greek agora and Roman forum were centers of both commerce and democracy, where citizens debated political issues and conducted public business. Similarly, medieval European town squares hosted markets, festivals, and public announcements. These spaces were designed to be accessible to all citizens, embodying ideals of equality and shared ownership.

In contrast, many modern cities have experienced a decline in truly public spaces. Urban development often prioritizes private property and commercial interests over communal gathering areas. Shopping malls, while superficially resembling public squares, are actually private property where behavior is regulated and certain groups may be excluded. This "privatization" of public life has consequences for democracy and social cohesion. When people have fewer opportunities to encounter diverse others in neutral, shared spaces, social divisions can deepen.

Urban planners like Jane Jacobs have argued that successful public spaces require certain characteristics. They must be easily accessible, safe, comfortable, and engaging. Jacobs emphasized the importance of "eyes on the street"—the natural surveillance that occurs when buildings face public areas and people use spaces throughout the day. Mixed-use neighborhoods, where residential, commercial, and recreational spaces coexist, tend to create more vibrant and secure public areas than single-use zones.

The COVID-19 pandemic highlighted both the importance of public spaces and their vulnerability. Parks and outdoor areas became crucial for mental health and safe socialization when indoor gatherings were restricted. Cities that had invested in extensive public space networks proved more resilient. However, the pandemic also revealed inequities in access to public space, with lower-income neighborhoods often having fewer parks and recreational areas. This has prompted renewed attention to equitable distribution of public amenities in urban planning.`,
    questions: [
      {
        questionNumber: 1,
        questionText: 'The main purpose of the passage is to:',
        choices: [
          {
            letter: 'A',
            text: 'Compare ancient and modern urban planning techniques.',
            isCorrect: false,
            explanation: 'While the passage mentions both ancient and modern cities, comparison is not its main purpose.',
          },
          {
            letter: 'B',
            text: 'Argue for the social and democratic importance of public spaces.',
            isCorrect: true,
            explanation: 'Correct. The passage emphasizes throughout that public spaces are "essential components of civic life" that facilitate democracy and community building.',
          },
          {
            letter: 'C',
            text: 'Describe the economic impact of shopping malls.',
            isCorrect: false,
            explanation: 'Shopping malls are mentioned briefly as an example of privatization, not as the main focus.',
          },
          {
            letter: 'D',
            text: 'Explain Jane Jacobs\' urban planning theories in detail.',
            isCorrect: false,
            explanation: 'Jacobs is mentioned as supporting evidence, but explaining her theories is not the main purpose.',
          },
        ],
      },
      {
        questionNumber: 2,
        questionText: 'According to the passage, shopping malls differ from traditional public squares because they:',
        choices: [
          {
            letter: 'A',
            text: 'Are located in suburban rather than urban areas.',
            isCorrect: false,
            explanation: 'The passage doesn\'t discuss the location of shopping malls.',
          },
          {
            letter: 'B',
            text: 'Focus on commercial rather than civic activities.',
            isCorrect: false,
            explanation: 'While partially true, this isn\'t the key distinction the passage emphasizes.',
          },
          {
            letter: 'C',
            text: 'Are privately owned and can exclude certain groups.',
            isCorrect: true,
            explanation: 'Correct. The passage states that malls "are actually private property where behavior is regulated and certain groups may be excluded."',
          },
          {
            letter: 'D',
            text: 'Were developed during the medieval period.',
            isCorrect: false,
            explanation: 'The passage discusses medieval town squares, not shopping malls, which are modern developments.',
          },
        ],
      },
      {
        questionNumber: 3,
        questionText: 'The passage suggests that the COVID-19 pandemic:',
        choices: [
          {
            letter: 'A',
            text: 'Permanently reduced the need for public spaces.',
            isCorrect: false,
            explanation: 'The passage suggests the opposite—the pandemic "highlighted...the importance of public spaces."',
          },
          {
            letter: 'B',
            text: 'Demonstrated inequalities in public space access.',
            isCorrect: true,
            explanation: 'Correct. The passage states the pandemic "revealed inequities in access to public space, with lower-income neighborhoods often having fewer parks."',
          },
          {
            letter: 'C',
            text: 'Led to the closure of all urban parks.',
            isCorrect: false,
            explanation: 'The passage indicates parks "became crucial" during the pandemic, not that they closed.',
          },
          {
            letter: 'D',
            text: 'Had no impact on urban planning priorities.',
            isCorrect: false,
            explanation: 'The passage states the pandemic "prompted renewed attention to equitable distribution of public amenities in urban planning."',
          },
        ],
      },
    ],
  },
];

async function seed() {
  console.log('Seeding database with sample passages...');

  try {
    for (const passageData of samplePassages) {
      // Insert passage
      const [passage] = await db
        .insert(passages)
        .values({
          title: passageData.title,
          content: passageData.content,
          category: passageData.category,
          difficulty: passageData.difficulty,
          estimatedTime: passageData.estimatedTime,
        })
        .returning();

      console.log(`Created passage: ${passage.title}`);

      // Insert questions and choices
      for (const questionData of passageData.questions) {
        const [question] = await db
          .insert(questions)
          .values({
            passageId: passage.id,
            questionNumber: questionData.questionNumber,
            questionText: questionData.questionText,
          })
          .returning();

        console.log(`  Created question ${question.questionNumber}`);

        // Insert answer choices
        for (const choiceData of questionData.choices) {
          await db.insert(answerChoices).values({
            questionId: question.id,
            choiceLetter: choiceData.letter,
            choiceText: choiceData.text,
            isCorrect: choiceData.isCorrect,
            explanation: choiceData.explanation,
          });
        }

        console.log(`    Created ${questionData.choices.length} answer choices`);
      }
    }

    console.log('\nSeeding completed successfully!');
    console.log(`Total passages created: ${samplePassages.length}`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
