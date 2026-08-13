# Papers in the Wild — Style Guide

> A writing manual, not a checklist. The goal is to make research papers feel like the best conversation you had this week, the one where someone smarter than you got obsessed with something weird and explained it over a long lunch.
>
> Built from studying writers and creators who actually do this well. The aim is not to copy their voice. It is to steal the underlying moves.

---

## 0. The thesis (read this first)

Most writing about AI research sounds like a research paper wearing a Halloween costume. Same shape underneath. Just a blog layout and a few metaphors stapled on. Readers close the tab.

The fix is not a better template. The fix is to write like a person who has fallen in love with a problem. Not a guru. Not an explainer. A person. People are uneven, opinionated, and a little weird. Their prose reflects that.

Everything below is in service of one question: **would you send this to a non-technical friend?** If the answer is "no, because it sounds like Content," rewrite.

### Audience: who we write for

This is the load-bearing decision. Papers in the Wild is written for **non-technical curious readers in the author's circle**. Founders, PMs, designers, technical-curious friends who do not write code for a living.

It is NOT written for:
- Researchers who already know the paper
- Coders who want to argue about implementation
- The author's future self, pretending to be an academic

If a reader IS technical and wants the code, the GitHub link is in the first comment of every LinkedIn post and in the Try It Yourself section of every blog. The blog itself stays accessible.

The test is: a smart friend at a bar, who has not written code since college, asking "so what did you do this week?" If they cannot follow your post, the post has failed.

---

## 1. The writers and creators I steal from (expanded 2026-08-13)

Steal moves, not voice. The aim is to blend these into a Papers in the Wild voice that sounds like none of them individually.

### The hacker peer

**Andrej Karpathy** writes like he is emailing a friend who happens to be technical. No explainer distance. Opens ["The Unreasonable Effectiveness of Recurrent Neural Networks"](https://karpathy.github.io/2015/05/21/rnn-effectiveness/) with: *"There's something magical about Recurrent Neural Networks (RNNs). I still remember when I trained my first recurrent network for Image Captioning. Within a few dozen minutes of training my first baby model..."*

Steal: the "I still remember when" personal-memory opener, the self-deprecating aside ("baby model", "arbitrarily-chosen"), the sideways admission of small embarrassment.

### The deadpan curious person

**Mary Roach** opens books about cadavers and digestion with the cadence of someone pouring themselves a second coffee. The opening of *Stiff*: *"Being dead is unsightly and stinky and embarrassing, and there's not a damn thing to be done about it."*

Steal: stacked short declaratives as an opening rhythm, the willingness to be blunt about the unblunted.

### The confused expert

**Julia Evans** (jvns.ca) opens most posts by admitting she did not understand something. Then she figured it out. Then she wrote up what she figured out. That is the whole structure. Her titles are throwaway on purpose: *"Some things I know about job scheduling"*.

Steal: the "I was confused about X, so I figured it out" pattern, tiny paragraphs often one sentence each, drawings as part of the prose.

### The dry wit

**Matt Levine** in *Money Stuff* describes absurd situations as if they are normal. The reader notices the absurdity. Levine does not point at it. He uses "also" as a structural pivot constantly because his whole structure is "here is the thing, also here is another thing, also also also."

Steal: understatement, the "also" pivot, willingness to follow tangents, the dry slightly-weary voice.

### The absurdly literal

**Randall Munroe** in [*What If*](https://what-if.xkcd.com) answers reader questions by taking them more seriously than the asker intended. He computes the actual answer, then traces the consequences to catastrophic endpoints. The humor comes from the literalism, not from jokes.

Steal: take the premise more seriously than warranted, compute the actual answer, follow consequences to ridiculous endpoints.

### The analogy novelist

**Tim Urban** in *Wait But Why* wraps every abstract concept in a concrete scene. The procrastination post does not start with "procrastination is a behavioral pattern." It introduces the "Instant Gratification Monkey" as a character. The character carries the rest of the post.

Steal: the invented character that embodies an abstract concept, concrete scenes over abstract descriptions, self-deprecation as the entry point to universal feelings.

### The wry tourist

**Bill Bryson** writes about science and history as if he is a slightly lost tourist. Always a little surprised by what he learns. Dense with named detail but conversational in rhythm.

Steal: the "wait, really?" tone when introducing facts, specific names and dates as texture rather than display of rigor.

### The contrarian analyst

A genre of tech blogger, **David Rosenthal** (*Store Notes*), parts of Stratechery. State the consensus. Poke at it. Long sentences. Named specifics. Strong opinions, weakly held.

Steal: the "everyone says X. The data says Y" pivot, named specifics not vague "many companies", strong opinions weakly held.

### The receipt-first observer

**Simon Willison** opens most posts with the observation itself. Direct statement, "Here is what I did", "Here is what I found", "Here is how I use LLMs to help me write code". The opening is the lede. No throat-clearing.

Steal: direct statement openings, "Here is" patterns, first-person transparency about the learning process.

---

## 2. YouTube and Substack creators I steal from

Print is one tradition. Video and newsletter are two more. Each has techniques print cannot match. PITW can borrow the underlying moves and render them in prose.

### The misconception-first opener

**Derek Muller (Veritasium)** starts with people being wrong. He shows interviews with random people confidently stating something incorrect, then systematically dismantles the misconception with experiments. His PhD research (well-documented) found that videos which simply state the correct answer are LESS effective than videos that surface and confront the wrong answer first.

Steal for PITW: if the paper you are covering overturns a common belief, open with the common belief. State it fairly. Then present the receipt that complicates it.

### The visual layer-builder

**Grant Sanderson (3Blue1Brown)** does not explain mathematical concepts. He builds them, layer by layer, on screen. Each animation step reveals something that was previously invisible. No jargon until the visual has already done the work.

Steal for PITW: for technical concepts, climb the translation ladder visibly. Do not just translate the jargon in prose. Use the `<Translation>` component so the reader sees the jargon, the plain English, the analogy, and the data as four distinct visual rows. The reader builds the concept layer by layer.

### The cinematic anchor

**Johnny Harris** opens videos with 30 to 60 seconds of striking imagery before any text or narration. The visual establishes stakes. The narrative arrives second.

Steal for PITW: the opening 100 words should establish a scene with imagery, not a thesis with abstraction. The `<Scene>` component exists for this. Open with the anxious-friend-at-the-door scene, not with "Prompt-induced waste is a phenomenon..."

### The spectacle-first engineer

**Mark Rober** builds absurdly over-the-top physical experiments (squirrel obstacle courses, glitter bomb traps) that viewers want to understand. The spectacle is the hook. The science makes the spectacle work.

Steal for PITW: when the experiment is visually dramatic (36 trial folders! files with weird names! a 9.62× wall-clock difference!), lead with the artifact, not the methodology.

### The no-nonsense skeptic

**Sabine Hossenfelder** is direct in a way that almost no AI writing is. *"As simple as possible, but not any simpler. No hype, no spin, no tip-toeing around inconvenient truths."* Her tagline is her technique. She actively debunks hype by examining what the research actually says versus what headlines claim.

Steal for PITW: if the paper's headline number feels too clean, say so. Track the gap between paper claims and what the data actually supports. The Honest Accounting callout exists for this.

### The doodler

**Vi Hart** opens her math videos with: *"O.K., let's say you're me and you're in math class."* Direct address. Immediate role-play. Breakneck speed. She never shows her face, only her hands doodling while she narrates.

Steal for PITW: the "let's say you're me" framing. Direct second-person address. Invite the reader into the scene as a participant, not an observer.

### The curious alongside

**Tom Scott** privileges curiosity over optimization. *"Make good stuff, find your ikigai, package honestly, audience over algorithm."* His videos have the sense of "I found this fascinating and wanted to understand it." Never "I am the expert teaching you."

Steal for PITW: this IS the build_to_think voice. The author is a curious person who happened to read the paper first, not an expert dispensing wisdom from above.

### The anonymous-rigor newsletter

**Kurzgesagt** uses adorable bird characters and flat design to explain terrifying topics (black holes, existential risks). The cute visuals create emotional safety for scary ideas. Their research process is documented: multiple expert reviews before any animation begins.

Steal for PITW: serious topics do not require grim presentation. Field Notebook's cream paper and oxblood seal create a warm container for cold data. The brand tone and the topic seriousness are not in tension. They work together.

---

## 3. Book authors who turn research into narrative

For longform inspiration when an episode blog post grows past 2,000 words.

### The umwelt-framer

**Ed Yong** in *An Immense World*: *"Each is enclosed within its own unique sensory bubble, perceiving but a tiny sliver of an immense world."* The opening reframes everything the reader is about to learn. The book is about umwelt, the sensory world each creature actually inhabits.

Steal for PITW: each AI research paper opens onto a slightly different umwelt. The bounded-efficiency instruction lives in one. The branch tournament lives in another. Open each episode with a sentence that names the umwelt, even if the reader does not yet know what it means.

### The anecdote-first researcher

**David Epstein** in *Range* and *The Sports Gene* opens every chapter with a specific person in a specific place at a specific time. The chapter then widens to the research. The pattern is: scene, paper, implication.

Steal for PITW: the scene-paper-implication structure is exactly the PITW episode anatomy (see §9). It works because readers commit to characters, not abstractions.

### The friendly mathematician

**Hannah Fry** in *Hello World* and *The Mathematics of Love* writes about math the way Mary Roach writes about cadavers. Direct, a little wry, willing to use herself as the butt of the joke. The math is real. The voice is human.

Steal for PITW: when an episode needs math, do not apologize for it and do not flinch from it. Use Hannah Fry's tone: "here is the equation, here is what it actually says in plain English, here is the absurd thing it predicts."

### The undercover economist

**Tim Harford** in *The Undercover Economist* and *The Data Detective* uses everyday objects and situations to anchor abstract economic concepts. He starts with a coffee cup, a supermarket, a traffic jam. The concept arrives through the object.

Steal for PITW: the AI coding agent is already an everyday object for the audience. Use it. The agent is the coffee cup. The prompt-induced waste is the traffic jam.

### The storyteller of science

**Phillip Dettmer** (Kurzgesagt founder) in *Immune*: a textbook's worth of immunology rendered as a narrative with characters, stakes, and scene breaks. Rigorous. Reviewed by experts. Also genuinely fun.

Steal for PITW: immune cells are not characters, but the AI coding agent literally IS a character in our stories. Anthropomorphize it deliberately. The brand new `<AgentLine>` component exists for this.

### The medical essayist

**Lewis Thomas** in *The Lives of a Cell* writes short essays (1,000 to 2,000 words each) that work because they are short. He does not pad. Each essay has one observation, one analogy, one landing. The whole book is a masterclass in what to leave out.

Steal for PITW: short posts are not unfinished posts. A 1,200-word episode that ends when the idea lands is better than a 2,500-word episode that pads to the spec.

---

## 4. The PITW voice, in one paragraph

Write like a smart friend who has just spent a week with a research paper and is now telling another smart friend about it over coffee. You are not lecturing. You are not presenting. You are telling, with genuine enthusiasm, with specific detail, with the occasional tangent, with a willingness to admit the parts you do not fully understand yet. You assume the reader is smart but not in your sub-field. You assume they are busy. You assume they will close the tab if you waste their time.

If your draft reads like a Substack post from someone trying to sound like a Substack post (the polished confessional opener, the curated vulnerability, the "I have a confession" template), rewrite it. If it reads like a research abstract, rewrite harder. If it reads like a LinkedIn carousel in longform, set it on fire.

---

## 5. Titles — the clinic

The title is the only line 90% of readers will ever see. Three jobs: earn the click, set the tone, make a promise the piece has to keep.

### Title patterns that work

**The character or protagonist (Wait But Why style):**
- *My AI has an anxiety problem.*
- *The very careful coding agent.*
- *The day my AI re-read its own homework.*

**The single-word Mary Roach:**
- *Waste: when your AI coding agent works overtime for nothing*
- *Certain: what happens when you tell your code assistant to be sure*
- *Spiral: the hidden tax on prompt politeness*

**The blunt quote (title IS the trigger phrase):**
- *"Be absolutely certain."* (subtitle: a story about my AI's anxiety problem and the one-sentence fix)

**The specific number, dryly stated:**
- *32 lines of code for a 4-line problem.*
- *9 extra tests, no extra bugs.*

**The contrarian pivot:**
- *Prompt engineering for agents is not persuasion.*
- *Stop being polite to your AI.*

### Title patterns that do not work (instant kill)

- Anything with "10x" or "revolutionary" or "the ultimate guide to"
- Anything that starts with "How I..." (overused Substack cliché)
- Anything that promises a list ("5 ways to...")
- Anything that is a question the reader is supposed to find intriguing ("Could your AI be wasting your money?")
- Anything over 80 characters
- Anything that requires the subtitle to make sense

### Choosing a title

Pick the title BEFORE writing the post. It forces you to commit to what the post is actually about. If you cannot pick a title, you do not yet know what the post is about.

The current Episode 1 title is **"My AI has an anxiety problem."** Six words. It names a character (the AI), an attribute (anxiety), and implies a story (a problem to be solved). The reader does not yet know what the AI is anxious about. They have to read to find out.

The subtitle carries the receipt: *I typed four words into a prompt. My AI took seven minutes to write four lines of code. So I ran 36 trials to find out why.*

---

## 6. How to open — twelve actual moves

These are observed moves that real writers make. Use the one that fits the story you are telling. Do not use the same one twice in a row.

### Move 1: The Karpathy (personal memory)

Open with a specific memory. A moment of surprise, confusion, or discovery. Concrete. Recent. Personal.

*Pattern:* "Some time ago I [action]. [Specific detail]. [The surprise]."

*When:* the paper or experiment produced a moment of genuine surprise for you.

### Move 2: The Mary Roach (stacked declaratives)

Three or four short sentences. Each one a self-contained statement. The reader knows exactly who you are by the end.

*Pattern:* "I am X. I do Y. I used to Z."

*When:* you want to establish voice immediately, before any content lands.

### Move 3: The Munroe (absurdly literal premise)

Take the question more seriously than warranted. Compute the actual answer. Do not wink at the reader.

*Pattern:* "What happens if [specific action]? I tried it. [Concrete result]."

*When:* the experiment itself is the hook.

### Move 4: The Wait But Why (invented character / scene)

Invent a small scene with characters. Use it to dramatize the abstract.

*Pattern:* "Imagine [specific scene with two characters]. [Character A does X]. [Character B does Y]. [Same outcome, different cost]."

*When:* the concept is technical enough that an analogy has to arrive before the data does.

### Move 5: The Simon Willison (receipt-first)

Three short declarative lines. Numbers. No throat-clearing.

*Pattern:* "[Fact]. [Contrasting fact]. [The punchline number]."

*When:* your numbers are dramatic enough to do the work. Use sparingly.

### Move 6: The Levine (absurd as normal)

Describe something obviously weird as if it is a Tuesday.

*Pattern:* "So, [company / agent / person] did [strange thing]. This is [understated framing]. Also, [additional strange thing]."

*When:* the absurdity is funny because it is understated.

### Move 7: The Veritasium (misconception first)

Open with the common belief. State it fairly. Then present the receipt that complicates it.

*Pattern:* "Most people assume [common belief]. The data says [complicating fact]."

*When:* the paper overturns something readers think they already know.

### Move 8: The Johnny Harris (visual anchor)

Open with a vivid scene that establishes stakes before any thesis lands. The reader sees the scene first.

*Pattern:* "[Specific visual detail]. [Specific visual detail]. [The tension the visual implies]."

*When:* the experiment has a visual or dramatic quality that should lead.

### Move 9: The 3Blue1Brown (layer-build)

Open with the simplest possible version of the concept. Promise to add complexity one layer at a time.

*Pattern:* "Start here: [simplest version]. Now add [layer 2]. Notice [consequence]. Now add [layer 3]..."

*When:* the concept requires the reader to build a mental model piece by piece.

### Move 10: The Vi Hart (direct second-person role-play)

Address the reader directly. Invite them into the scene as a participant.

*Pattern:* "Let's say you're me. You're in [scene]. You [action]. [The consequence]."

*When:* you want maximum reader immersion.

### Move 11: The Sabine Hossenfelder (no-nonsense fact-check)

Open with a claim, usually from a headline or a marketing page. Immediately correct it with the actual data.

*Pattern:* "[Headline says X]. Here is what is actually going on."

*When:* the AI hype machine is misrepresenting the paper.

### Move 12: The Ed Yong (reframe)

Open with a sentence that names the umwelt of the paper, even using a word the reader does not yet know. The rest of the post defines it.

*Pattern:* "[Term you have never heard] is [plain English definition]. [Why it matters]."

*When:* the paper's central concept is unfamiliar enough to need naming before explaining.

### Moves to never use

- **"I have a confession"** (Substack cliché)
- **"In today's rapidly evolving..."** (corporate filler)
- **"Let's dive in" / "Let's explore"** (AI filler)
- **"Have you ever wondered..."** (dead)
- **"Picture this:"** (overused)
- **"I'm excited to share..."** (please stop)
- **"Buckle up"** (Substack-template)
- **"In this post, we'll..."** (signposting filler)

---

## 7. Sentence-level craft

This is the layer where AI-written prose dies.

### Rhythm

Vary sentence length aggressively. A short sentence. Then a longer one that lets the reader breathe and gives the writer room to set up a more nuanced point. Then a short one. **Then a fragment.**

Then maybe a one-word paragraph.

Yes.

The above rhythm feels human because human speech varies. AI prose tends to have a flat metronomic cadence, sentence, sentence, sentence, all the same length. If you read your draft aloud and it sounds metronomic, rewrite.

### Em-dash ban

The em-dash (`—`) is completely banned in all Papers in the Wild content. This is non-negotiable. The em-dash is the LLM's signature stylistic crutch and the single most-violated tell in production writing.

Replace every em-dash with one of:
- A period (split into two sentences)
- A comma
- A colon
- Parentheses
- A regular hyphen with spaces (` - `)

Date ranges use a regular hyphen: `2024-2026`, not `2024–2026`.

### Concrete nouns over abstract nouns

| Do not write | Write |
|---|---|
| "The agent performed additional verification steps" | "The agent re-read its own code, wrote 9 extra tests, and ran the suite again" |
| "Cost variance was significant" | "It cost 4 times more" |
| "User engagement increased" | "Two thousand more people opened the email" |
| "Various stakeholders" | "Three VCs, two engineers, and a designer" |

### Verbs over adjectives

| Do not write | Write |
|---|---|
| "The result was surprising" | "The result punched me in the face" |
| "The system is robust" | "The system survived 10,000 concurrent users without a hiccup" |
| "The paper is well-written" | "I read the paper in one sitting" |

### The "specific named detail" texture

Good prose has texture. Names. Dates. Specific URLs. Specific people. Not "many AI models" but "DeepSeek-V4-Pro, Kimi-K2.6, Nemotron-3-Ultra." Not "last year" but "August 2026." Not "a major company" but "Anthropic."

This is the Bryson move. Named detail makes prose feel reported, not generated.

### The single-word paragraph

Use it. Often. It is the loudest tool in the box.

No.

Yes.

(Really. One word. Standalone paragraph. Use it.)

---

## 8. The complicated-thing translation ladder

When you have to explain a technical concept, climb the ladder. Do not skip rungs. Use the `<Translation>` component so the reader sees the four rungs visibly.

**Rung 1: Name the term.** One sentence. The actual jargon, in quotes.
**Rung 2: Translate to plain English.** One sentence. No jargon.
**Rung 3: Anchor with an analogy.** One paragraph. Human scale.
**Rung 4: Demonstrate with actual data.** One paragraph. Receipts.

If a paragraph stays on Rung 1 (naming the term without translation), rewrite. If a paragraph jumps from Rung 1 to Rung 4 with no analogy bridge, rewrite.

### The "smart non-technical friend" test

For any technical concept in your post, ask: could I explain this to a curious friend at a bar who has not written code since college?

If yes, you have climbed the ladder correctly. If no, you have skipped a rung.

(This used to be the "smart 12-year-old" test. We changed it because the audience is not 12-year-olds. It is smart adults without technical context. Adjust accordingly.)

---

## 9. Component use (when to use which)

The site has six new storytelling components (added 2026-08-13). Use them deliberately. Each one exists because prose alone could not do the job.

| You want to... | Use | Why prose fails |
|---|---|---|
| Show a paper's one-line quote | `PullQuote` | Inline italic gets lost |
| Show the AI's literal output as dialogue | `AgentLine` | The AI is a character. Its speech deserves its own visual treatment. |
| Show a verbatim prompt | `PromptBlock` | Inline code blocks do not signal "this is a prompt you can copy" |
| Show a key dramatic number | `BigStat` | Numbers inside paragraphs do not land. Numbers alone, large, do. |
| Show a story analogy / scene | `Scene` | Analogies inside paragraphs get skipped. Boxed, they get read. |
| Show a technical term and its translation | `Translation` | The four-rung ladder has to be visible, not implied. |
| Show the receipt (data table) | `ReceiptTable` | Always. Mandatory in every episode. |
| Show a Try-It / Honest-Accounting / Note block | `Callout` | These sections deserve visual distinction from body. |
| Show a section divider | `InkRule` | Standard `<hr>` looks like markdown. InkRule looks like the brand. |
| Inline numbers in body text | `Num` | Numbers should always be mono and slightly oxblood. |

### Component discipline rules

- **One BigStat per key finding.** If the post has three BigStats, it has too many key findings.
- **Never two Scenes in a row.** Vary the visual rhythm.
- **PromptBlock must include tone.** `bad`, `good`, or `neutral`. The tone drives the left bar color. Semantic, never decorative.
- **Callout variant matches content.** Do not use `warn` for content that is not actually a warning. Readers learn the visual language fast.
- **Translation is for jargon.** Do not use it for non-technical concepts. If the term does not need translation, do not reach for the component.

---

## 10. Humor — how to be funny without trying

The fastest way to be unfunny is to try to be funny. The second-fastest is to use a joke template (the "it me" meme, the "nobody:" tweet, the "I am once again asking" format).

Humor in good prose comes from three places.

### 1. Understatement

Describe an absurd thing as if it is normal. The reader notices the absurdity. You do not have to point at it.

*Bad:* "OMG my AI literally wrote 32 lines of code for a 4-line problem, can you even??"

*Good:* "My AI wrote 32 lines of code for a 4-line problem. It also added a TypeError check that no test exercised. Anyway, the function worked."

### 2. Specific absurd detail

The humor is in the specificity. A general absurdity is not funny. A precisely described absurdity is.

*Bad:* "AI does a lot of unnecessary work."

*Good:* "The agent wrote a 20-line docstring explaining an algorithm that fits in one regex."

### 3. Following the logic to its endpoint

Take the idea seriously. Compute the consequence. Land on the punchline.

*Example:* "If 'be absolutely certain' costs 4 times more than 'work efficiently' on a trivial task, and the multiplier scales with complexity, then on a 4-hour bug fix I am paying 16 hours of compute to add the word 'absolutely.' That is the most expensive adverb I have ever bought."

### Humor mechanics to never use

- The "I'll see myself out" closer
- The "wait for it" setup
- The "if you know, you know" wink
- Puns in titles (unless you are genuinely good at them, which most people are not)
- Emoji as punchline

---

## 11. The Receipt Table — our signature

Treat every Receipt Table as a small piece of theater. Set it up. Reveal it. Pay it off.

**Before the table:** tell the reader what to look for. Specifically. "Watch the bottom row."

**The table itself:** only the columns that tell the story. Not every column you measured. The full dataset goes in the repo, not in the post.

**After the table:** state the punchline explicitly. "Same correct answer. 4 times more work." Do not trust the reader to do the math themselves. They will not.

**Caption:** every table gets one. Source. Sample size. The one observation the reader might miss.

### Audience-friendly column headers

For non-technical readers, columns like "Avg tool calls" are jargon. Translate. Use "Average work done" or "Average actions" instead. The caption can specify what counts as a "tool call" or "action."

---

## 12. Episode structure — the nine beats

Every episode hits these beats in this order. Trust the order. It is earned.

1. **Hook** (50 to 200 words). Open with one of the twelve moves from §6. End on an implicit "so I dug in."
2. **The paper** (200 to 300 words). Name it. Link it. Plain-English translation. One specific number from the paper itself.
3. **What I did** (200 to 400 words). The experiment design. Be specific about tasks, models, trial counts. This is where you earn credibility for the receipts.
4. **What happened** (300 to 500 words plus ReceiptTable). The centerpiece. Walk to the table. Reveal it. Pay it off.
5. **What surprised me** (150 to 300 words). The "huh, that is weird" moment. Mandatory. Reader trusts you more when you admit something you did not expect.
6. **What it means** (200 to 400 words). The "so what." Translate findings into actions the reader can take today.
7. **Honest accounting** (100 to 200 words, mandatory). Caveats, biases, N counts, what this does not prove. Use the `<Callout variant="honest">` component.
8. **Try it yourself** (100 to 200 words, mandatory). Replication steps. Repo links. Specific commands. Use the `<Callout variant="try">` component.
9. **Closing** (50 to 150 words). One short paragraph that lands. Not a summary. A punch.

Total: 1,500 to 2,500 words. Aim for ~2,000.

---

## 13. Anti-voice — the never-use list (expanded)

These words and phrases are AI shibboleths. Any one of them in your draft is a flag. Rewrite the sentence.

**The academic-tell list:**
- delve · leverage · utilize · facilitate · underscore · moreover · furthermore · nevertheless · in conclusion · it is worth noting that · as previously mentioned

**The Substack-template list:**
- "I have a confession" · "I'm excited to share" · "I've been thinking a lot about" · "let's dive in" · "let's explore" · "buckle up" · "in this post, we'll"

**The LinkedIn-carousel list:**
- "game-changer" · "revolutionary" · "mind-blowing" · "unlock" · "seamless" · "robust" · "10x" (as vague hype, not as a real number) · "what this means for the future of"

**The AI-meta list:**
- "in today's rapidly evolving landscape" · "in the age of AI" · "as AI continues to" · "with the rise of" · "the future of work"

**The AI-vocabulary list (per multiple independent sources, 2026-08-13):**
- "tapestry" · "manifold" · "realm" · "landscape" · "harness" · "supercharge" · "transformative" · "paradigm" · "cutting-edge" · "testament" · "embark" · "foster" · "synergy" · "innovative" · "navigating"

**The filler-phrase list:**
- "it's important to note that" · "it's worth mentioning that" · "needless to say" · "at the end of the day" · "the bottom line is"

**The structural-pattern list:**
- "This isn't just X, it's Y" (AI copy cliché)
- "On the one hand / on the other hand" (false neutrality)
- Ending every section with a moralizing summary
- Quoting famous people unnecessarily (Einstein, Jobs) for padding

**The em-dash (non-negotiable):**
- Zero em-dashes (`—`) anywhere. Not in titles, not in body, not in quotes, not in captions. See §7.

If you find yourself reaching for any of these, the sentence is broken. Rewrite it. Usually the rewrite is shorter.

---

## 14. Pre-publish checks

Before shipping any episode:

1. Read the title aloud. Does it sound like a Mary Roach book title or a LinkedIn carousel title? If the latter, rewrite.
2. Read the opening 100 words. Does it use one of the twelve moves from §6? If it uses "I have a confession" or any anti-voice phrase, rewrite.
3. Count specific numbers in the first 200 words. Should be at least 2.
4. For every technical term, did you climb the translation ladder (§8) within 3 sentences? If you used the `<Translation>` component, did you fill all four rows?
5. ReceiptTable present? Captioned? Set up and paid off?
6. Honest accounting callout present?
7. Try it yourself callout present?
8. Read the closing aloud. Does it land, or does it summarize? If summarize, rewrite.
9. Read the whole thing aloud. Any sentence you stumble on, rewrite.
10. The "smart non-technical friend at the bar" test: would you send this to your smartest non-technical friend? If no, why no?
11. Em-dash scan: search the document for `—` and `–`. Replace every instance.
12. AI-vocabulary scan: search for every word in §13. Flag and rewrite every instance.

---

## 15. A short example in the full voice

To make this concrete. Here is how the current Episode 1 opens:

> Imagine you ask your most anxious friend to check if the front door is locked. Just a quick check, you say, just to be sure.
>
> They walk over. They look at the lock. It is locked. They walk away.
>
> Then they come back. Check again. Still locked. They ask you if they actually checked it. You say yes. They write themselves a note that says "I checked the door at 4:47 PM." They read the note. They check the door again.
>
> The door was locked the whole time. Every extra check made them feel better. None of those checks made the door more locked.

Note the moves: the Wait-But-Why invented scene (Move 4), no jargon until the scene lands, specific concrete detail (the note at 4:47 PM), the closing one-line paragraph that names the principle.

The voice is reported, not confessional. Specific, not vague. The humor is in the specificity. The reader is a participant ("imagine you ask"), not a spectator.

This is what we are aiming for.

---

## 16. How to use this guide

Read §1, §2, §3 (the writers and creators) before starting any episode. Pick whose move you are going to steal for the opening.

Read §5 (titles) when titling.

Read §6 (openings) when writing the first 200 words.

Read §8 (translation ladder) every time you have to explain a technical concept.

Read §9 (components) to pick which visual treatment each section needs.

Read §13 (anti-voice) before publishing.

Read §14 (pre-publish) at the end.

The rest is reference. Come back to it when you get stuck.

---

## 17. Sources and further reading

The writers and creators cited above are linked inline. The full reference set:

**Print / blog:**
- [Andrej Karpathy: Unreasonable Effectiveness of RNNs](https://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [Julia Evans: jvns.ca](https://jvns.ca)
- [Matt Levine: Money Stuff (Bloomberg)](https://www.bloomberg.com/opinion/authors/ARbTQlQRYN8/matthew-s-levine)
- [Randall Munroe: What If](https://what-if.xkcd.com)
- [Tim Urban: Wait But Why](https://waitbutwhy.com)
- [Simon Willison: simonwillison.net](https://simonwillison.net)
- [David Rosenthal: Store Notes](https://blog.dshr.org)

**YouTube:**
- [Veritasium (Derek Muller)](https://www.youtube.com/@veritasium)
- [3Blue1Brown (Grant Sanderson)](https://www.youtube.com/@3blue1brown)
- [Johnny Harris](https://www.youtube.com/@johnnyharris)
- [Mark Rober](https://www.youtube.com/@markrober)
- [Kurzgesagt](https://www.youtube.com/@kurzgesagt)
- [MinutePhysics (Henry Reich)](https://www.youtube.com/@minutephysics)
- [Sabine Hossenfelder](https://www.youtube.com/@SabineHossenfelder)
- [Tom Scott](https://www.youtube.com/@TomScottGoingNegative)
- [Vi Hart](https://www.youtube.com/@vihart)
- [Physics Girl (Dianna Cowern)](https://www.youtube.com/@physicswoman)

**Books:**
- Mary Roach: *Stiff*, *Gulp*, *Fuzz*
- Ed Yong: *I Contain Multitudes*, *An Immense World*
- David Epstein: *Range*, *The Sports Gene*
- Hannah Fry: *Hello World*, *The Mathematics of Love*
- Tim Harford: *The Undercover Economist*, *The Data Detective*
- Hans Rosling: *Factfulness*
- Phillip Dettmer: *Immune*
- Lewis Thomas: *The Lives of a Cell*
- Randall Munroe: *Thing Explainer*, *What If?*
- Bill Bryson: *A Short History of Nearly Everything*

**Newsletters:**
- Timothy Lee: *Understanding AI* (Substack)
- Nathan Lambert: *Interconnects*
- Casey Newton: *Platformer*
- Gary Marcus: *Marcus on AI*

---

*Last updated 2026-08-13. Living document. Update when a real reader feedback invalidates a rule.*
