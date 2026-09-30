export interface MCQOption {
  letter: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  label: string;
  type: 'mcq' | 'long' | 'short';
  options?: MCQOption[];
}

export interface AssessmentSection {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  questions: AssessmentQuestion[];
}

// Sections 2-7 of the Startup & Entrepreneurship assessment.
// Section 1 (Personal Details) is rendered separately in StartupAssessmentForm
// since it reuses the shared applicant fields (name, email, phone, college, etc.).
export const STARTUP_ASSESSMENT_SECTIONS: AssessmentSection[] = [
  {
    id: 'motivation',
    step: 2,
    title: 'Startup Motivation',
    subtitle: 'Tell us what draws you to NeuraMorphix and to startup life.',
    questions: [
      { id: 'why_join_neuramorphix', number: 9, type: 'long', label: 'Why do you want to join NeuraMorphix?' },
      { id: 'why_startup_environment', number: 10, type: 'long', label: 'Why do you want to work in a startup environment?' },
      { id: 'why_hire_you', number: 11, type: 'long', label: 'Why should we hire you?' },
      { id: 'what_contribute', number: 12, type: 'long', label: 'What do you want to contribute to NeuraMorphix?' },
    ],
  },
  {
    id: 'mindset',
    step: 3,
    title: 'Startup Mindset',
    subtitle: 'How you think and react in early-stage, ambiguous situations.',
    questions: [
      {
        id: 'startup_attraction',
        number: 13,
        type: 'mcq',
        label: 'What attracts you most to an early-stage startup?',
        options: [
          { letter: 'A', text: 'Building something from the ground up' },
          { letter: 'B', text: 'Learning quickly through real work' },
          { letter: 'C', text: 'Taking ownership and responsibility' },
          { letter: 'D', text: 'Working closely with a small team' },
          { letter: 'E', text: 'All of the above' },
        ],
      },
      {
        id: 'incomplete_instructions',
        number: 14,
        type: 'mcq',
        label: 'You are given a task but the instructions are incomplete. What would you most likely do?',
        options: [
          { letter: 'A', text: 'Wait until someone gives me complete instructions' },
          { letter: 'B', text: 'Ignore the task until someone follows up' },
          { letter: 'C', text: 'Research the problem, understand the objective, and propose a way forward' },
          { letter: 'D', text: 'Ask another teammate to do it' },
        ],
      },
      {
        id: 'idea_rejected',
        number: 15,
        type: 'mcq',
        label: 'Your idea is rejected by the team. What would you do?',
        options: [
          { letter: 'A', text: 'Stop sharing ideas' },
          { letter: 'B', text: 'Argue until everyone agrees with me' },
          { letter: 'C', text: 'Understand the feedback and improve or rethink the idea' },
          { letter: 'D', text: 'Leave the project' },
        ],
      },
      {
        id: 'project_fails',
        number: 16,
        type: 'mcq',
        label: 'A project you worked on for several weeks fails. What should happen next?',
        options: [
          { letter: 'A', text: 'Find someone to blame' },
          { letter: 'B', text: 'Abandon the project immediately' },
          { letter: 'C', text: 'Analyse what went wrong, learn from it, and decide whether to iterate or pivot' },
          { letter: 'D', text: 'Continue exactly as before' },
        ],
      },
      {
        id: 'unassigned_problem',
        number: 17,
        type: 'mcq',
        label: "You notice an important problem that isn't officially assigned to you. What do you do?",
        options: [
          { letter: 'A', text: "Ignore it because it isn't my responsibility" },
          { letter: 'B', text: 'Wait until someone assigns it' },
          { letter: 'C', text: 'Bring it up and help find a solution' },
          { letter: 'D', text: 'Tell someone else to handle it' },
        ],
      },
      {
        id: 'important_quality',
        number: 18,
        type: 'mcq',
        label: 'Which quality is most important for someone working in an early-stage startup?',
        options: [
          { letter: 'A', text: 'Having an impressive title' },
          { letter: 'B', text: 'Taking ownership and executing' },
          { letter: 'C', text: 'Attending many meetings' },
          { letter: 'D', text: 'Having the largest network' },
        ],
      },
      {
        id: 'unknown_task',
        number: 19,
        type: 'mcq',
        label: "You are asked to do something you don't know how to do. What would you do?",
        options: [
          { letter: 'A', text: 'Say that I cannot do it' },
          { letter: 'B', text: 'Wait for someone to teach me everything' },
          { letter: 'C', text: 'Learn the basics, ask relevant questions, and attempt it' },
          { letter: 'D', text: 'Give the task to someone else' },
        ],
      },
      {
        id: 'teammate_struggling',
        number: 20,
        type: 'mcq',
        label: 'You have completed your work while another teammate is struggling with theirs. What would you do?',
        options: [
          { letter: 'A', text: "Leave because their work isn't my responsibility" },
          { letter: 'B', text: 'Help them if I can' },
          { letter: 'C', text: 'Wait until they fail' },
          { letter: 'D', text: 'Immediately report them' },
        ],
      },
    ],
  },
  {
    id: 'ownership',
    step: 4,
    title: 'Ownership & Leadership',
    subtitle: 'How you take charge and lead when responsibility is on you.',
    questions: [
      {
        id: 'ownership_meaning',
        number: 21,
        type: 'mcq',
        label: 'What does "taking ownership" mean to you?',
        options: [
          { letter: 'A', text: 'Only completing assigned tasks' },
          { letter: 'B', text: 'Taking responsibility for the outcome and finding solutions when problems arise' },
          { letter: 'C', text: 'Making all decisions yourself' },
          { letter: 'D', text: "Taking credit for the team's work" },
        ],
      },
      {
        id: 'new_initiative_first_step',
        number: 22,
        type: 'mcq',
        label: 'If you were given responsibility for a new initiative at NeuraMorphix, what would you do first?',
        options: [
          { letter: 'A', text: 'Start building immediately without understanding the problem' },
          { letter: 'B', text: 'Understand the objective, research the problem, and create an action plan' },
          { letter: 'C', text: 'Wait for someone else to define everything' },
          { letter: 'D', text: 'Delegate everything immediately' },
        ],
      },
      {
        id: 'leadership_approach',
        number: 23,
        type: 'mcq',
        label: 'Which statement best describes your approach to leadership?',
        options: [
          { letter: 'A', text: 'A leader should make every decision' },
          { letter: 'B', text: 'A leader should delegate everything' },
          { letter: 'C', text: 'A leader should create clarity, take responsibility, and help the team succeed' },
          { letter: 'D', text: 'Leadership is only about having authority' },
        ],
      },
      {
        id: 'disagree_with_senior',
        number: 24,
        type: 'mcq',
        label: 'If you disagree with a decision made by a senior team member, what would you do?',
        options: [
          { letter: 'A', text: 'Ignore the decision and do things my way' },
          { letter: 'B', text: 'Stay silent even if I have useful information' },
          { letter: 'C', text: 'Respectfully present my reasoning and evidence, then support the final decision' },
          { letter: 'D', text: 'Argue until my opinion is accepted' },
        ],
      },
    ],
  },
  {
    id: 'scenarios',
    step: 5,
    title: 'Startup Scenarios',
    subtitle: 'How you would navigate real early-stage startup situations.',
    questions: [
      {
        id: 'little_market_info',
        number: 25,
        type: 'mcq',
        label: 'NeuraMorphix is launching a new idea but there is very little information about the market. What should the team do first?',
        options: [
          { letter: 'A', text: 'Build the complete product immediately' },
          { letter: 'B', text: 'Spend heavily on advertising' },
          { letter: 'C', text: 'Research the problem and validate it with potential users' },
          { letter: 'D', text: 'Copy an existing company' },
        ],
      },
      {
        id: 'negative_feedback',
        number: 26,
        type: 'mcq',
        label: 'A user gives negative feedback about something your team built. What would you do?',
        options: [
          { letter: 'A', text: 'Ignore the feedback' },
          { letter: 'B', text: 'Take it personally' },
          { letter: 'C', text: 'Understand the underlying problem and use the feedback to improve' },
          { letter: 'D', text: 'Tell the user they are wrong' },
        ],
      },
      {
        id: 'limited_resources_priority',
        number: 27,
        type: 'mcq',
        label: 'Your team has limited time and resources. What should you prioritise?',
        options: [
          { letter: 'A', text: 'Everything at once' },
          { letter: 'B', text: 'The work that creates the most important impact' },
          { letter: 'C', text: 'The easiest tasks' },
          { letter: 'D', text: 'Tasks that look impressive' },
        ],
      },
      {
        id: 'two_ideas_investigate',
        number: 28,
        type: 'mcq',
        label: 'You have two ideas. One is exciting but has no clear user problem. The other solves a clear problem but is less exciting. What should you investigate first?',
        options: [
          { letter: 'A', text: 'The exciting idea only' },
          { letter: 'B', text: 'The idea with the clearest validated problem' },
          { letter: 'C', text: 'Both without researching either' },
          { letter: 'D', text: 'Whichever is easier to present' },
        ],
      },
      {
        id: 'missed_deadline',
        number: 29,
        type: 'mcq',
        label: 'Your team misses an important deadline. What is the best response?',
        options: [
          { letter: 'A', text: 'Hide the delay' },
          { letter: 'B', text: 'Blame the person responsible' },
          { letter: 'C', text: 'Understand why it happened, communicate clearly, and create a recovery plan' },
          { letter: 'D', text: 'Ignore the deadline' },
        ],
      },
    ],
  },
  {
    id: 'founding',
    step: 6,
    title: 'Founding-Team Potential',
    subtitle: 'Your vision for what you could build and lead at NeuraMorphix.',
    questions: [
      { id: 'founding_team_reason', number: 30, type: 'long', label: 'Why should we consider you for a future founding-team position at NeuraMorphix?' },
      { id: 'improve_or_build', number: 31, type: 'long', label: 'If you joined NeuraMorphix today, what is one thing you would want to improve or build? Why?' },
      { id: 'first_three_steps', number: 32, type: 'long', label: 'If you were given ownership of a new initiative, what would your first three steps be?' },
      { id: 'real_world_problem', number: 33, type: 'long', label: 'What is one real-world problem you believe could become a startup opportunity?' },
      { id: 'first_idea_failed', number: 34, type: 'long', label: 'What would you do if your first startup idea failed?' },
    ],
  },
  {
    id: 'commitment',
    step: 7,
    title: 'Commitment',
    subtitle: 'How you feel about the uncertainty and pace of startup work.',
    questions: [
      {
        id: 'comfort_with_uncertainty',
        number: 35,
        type: 'mcq',
        label: 'Startup environments can involve uncertainty, changing priorities, and responsibilities beyond an initial role. How comfortable are you with this?',
        options: [
          { letter: 'A', text: 'Very comfortable' },
          { letter: 'B', text: 'Comfortable and willing to learn' },
          { letter: 'C', text: 'Somewhat comfortable' },
          { letter: 'D', text: 'I prefer strictly defined responsibilities' },
        ],
      },
      {
        id: 'willing_to_commit',
        number: 36,
        type: 'mcq',
        label: 'If selected, are you willing to consistently contribute, learn, and take responsibility for your work?',
        options: [
          { letter: 'A', text: 'Yes' },
          { letter: 'B', text: 'Mostly yes' },
          { letter: 'C', text: "I'm not sure" },
          { letter: 'D', text: 'No' },
        ],
      },
      {
        id: 'completion_sentence',
        number: 37,
        type: 'short',
        label: 'Complete this sentence: "I want to join NeuraMorphix because __________."',
      },
    ],
  },
];

export const STARTUP_ASSESSMENT_TOTAL_STEPS = 7;
