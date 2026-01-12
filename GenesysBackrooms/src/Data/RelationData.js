const data = [
  // Hostile Relation - M.E.G. vs Auto Nexus
  {
    id: "relation-aun-meg",
    factionA: "aun",
    factionB: "meg",
    
    status: "Hostile",
    established: "1964",
    firstContact: "1950",
    lastUpdated: "2024",
    
    perspectives: {
      factionA: {
        viewpoint: "M.E.G. represents the oppressive old guard - corporate structure, hierarchical control, and exploitation of workers. Their refusal to share resources fairly forced us to break away and build something better.",
        significantEvents: [
          {
            event: "Worker Representation Denied (1962)",
            reason: "M.E.G. leadership refused to give workers meaningful voice in decision-making. This proved the system couldn't be reformed from within."
          },
          {
            event: "Ford Four Liberation (1964)",
            reason: "Not a defection - a liberation. Four brave workers freed themselves and valuable equipment from corporate control to build a better society."
          },
          {
            event: "Level 275 Defense (2019)",
            reason: "M.E.G. aggression against our territory was heroically repelled. Proved we can defend ourselves against imperialist expansion."
          }
        ],
        currentSentiment: "M.E.G. remains an active threat to worker autonomy. Their embargo hurts our people but strengthens our resolve. Peace requires them accepting our right to exist independently. Until then, we prepare for inevitable conflict."
      },
      factionB: {
        viewpoint: "Auto Nexus are traitors who abandoned humanity for power. The Ford Four defection was theft and betrayal. Their socialist rhetoric covers resource hoarding and authoritarian control.",
        significantEvents: [
          {
            event: "Ford Four Defection (1964)",
            reason: "The moment of betrayal. They stole critical equipment and research. This treachery defines why we can never trust them."
          },
          {
            event: "Level 275 Invasion (2019)",
            reason: "We attempted to reclaim stolen territory. Their violent resistance proved their hostile intent."
          },
          {
            event: "Convoy Ambush (2023)",
            reason: "Recent proof of their barbarism. Attacked our supply convoy, killed three operatives. They remain dangerous criminals."
          }
        ],
        currentSentiment: "Complete embargo justified by their continued hostility. Peace impossible unless they return stolen property and acknowledge wrongdoing. They're a permanent cold war threat requiring constant vigilance."
      }
    },
    
    sharedHistory: {
      rootCause: "The 1964 'Ford Four Defection' split M.E.G. when four founding members left with equipment and followers to establish Auto Nexus. M.E.G. viewed this as theft and betrayal; A.U.N. viewed it as liberation from corporate oppression. Neither side has reconciled these incompatible narratives.",
      majorEvents: [
        {
          year: "1950",
          month: null,
          event: "First Contact",
          description: "The four future founders of A.U.N. join M.E.G. as workers and researchers.",
          outcome: "Initial cooperation and integration into M.E.G. structure.",
          impact: "Seeds of future conflict planted as workers observe M.E.G. hierarchy."
        },
        {
          year: "1962",
          month: "March",
          event: "Worker Council Proposal",
          description: "Workers request formal representation in M.E.G. decision-making. Leadership tables the proposal indefinitely.",
          outcome: "Growing resentment among worker faction.",
          impact: "Radicalization begins among future A.U.N. founders."
        },
        {
          year: "1964",
          month: "September",
          event: "Ford Four Defection",
          description: "Four senior M.E.G. members depart with equipment, research, and 23 followers to establish Auto Nexus.",
          outcome: "Permanent split. M.E.G. declares defectors criminals.",
          impact: "Hostile relationship established. Both sides prepare for conflict."
        },
        {
          year: "1975",
          month: null,
          event: "First Border Skirmish",
          description: "Armed encounter between patrols in contested territory. Three casualties total.",
          outcome: "Informal ceasefire established. Border zones become no-man's land.",
          impact: "Pattern of limited violence with implicit rules established."
        },
        {
          year: "2019",
          month: "June",
          event: "Level 275 Conflict",
          description: "M.E.G. attempts to establish outpost in A.U.N.-claimed territory. A.U.N. responds with force.",
          outcome: "M.E.G. withdrawal after week of fighting. 12 casualties.",
          impact: "Relationship worsens. Trade embargo tightened."
        },
        {
          year: "2023",
          month: "November",
          event: "Convoy Ambush",
          description: "M.E.G. supply convoy attacked in disputed territory. A.U.N. claims self-defense, M.E.G. claims unprovoked attack.",
          outcome: "Three M.E.G. operatives killed. Relations at lowest point in decades.",
          impact: "Hardliners on both sides gain influence. Peace talks suspended."
        }
      ]
    },
    
    encounterBehavior: {
      civilizedPublicSpaces: "Maintain hostile distance. Verbal insults common. Violence rare due to neutral intervention but tension palpable. Other factions often separate them.",
      factionATerritory: "M.E.G. members detained on sight. Questioned extensively about M.E.G. operations. Usually expelled after 24-48 hours. High-value targets may be imprisoned.",
      factionBTerritory: "A.U.N. members arrested immediately. Interrogated as potential spies. May be held indefinitely or exchanged in prisoner swaps.",
      wilderness: "Combat likely unless one side significantly outnumbered. May take prisoners for exchange. No quarter expected. Temporary truces only if mutual threat from entities.",
      playerWithAllyCoins: "M.E.G. confiscates A.U.N. currency, questions player about enemy contact. A.U.N. confiscates M.E.G. currency, lectures player about capitalist oppression. Both sides suspicious of dual-faction traders."
    },
    
    questHooks: [
      "Rescue prisoners held by either faction before prisoner exchange falls through",
      "Investigate claims of war crimes committed during Level 275 conflict",
      "Mediate between moderate factions seeking secret peace talks",
      "Escort defector from one faction to safety in the other",
      "Recover stolen research before it escalates conflict",
      "Prevent assassination of peace advocate by hardliners on either side",
      "Document neutral perspective on Ford Four defection for historical record"
    ],
    
    dmNotes: {
      howToRun: "Neither side is purely evil. M.E.G. has legitimate grievances about theft and betrayal. A.U.N. has legitimate grievances about worker exploitation. Let players discover both sides have valid points and flawed responses. Avoid making either side mustache-twirling villains.\n\nThe conflict is essentially ideological - corporate hierarchy vs worker collective. Neither system is perfect, and both sides have compromised their ideals over decades of conflict.",
      commonScenarios: [
        "Players hired by one side discover mission would harm innocents on the other",
        "Players caught in firefight between patrols in disputed territory",
        "Players discover evidence that challenges official narrative on either side",
        "Players must choose which faction to help when both need same resource",
        "Players find moderate members from both sides secretly cooperating",
        "Players witness atrocity committed by faction they previously supported"
      ],
      balanceTips: "M.E.G. has more resources and organization. A.U.N. has more fervent dedication and guerrilla expertise. Neither can defeat the other outright. M.E.G. could overwhelm A.U.N. but cost would be catastrophic. A.U.N. can't match M.E.G. conventionally but makes occupation impossible. This stalemate allows player actions to matter.\n\nIf players consistently help one side, have the other side take notice - not to punish players, but to create consequences that feel real."
    },
    
    tags: ["cold-war", "ideological", "major-conflict", "player-impactful"],
    sessionVisibility: {}
  },

  // Friendly Relation - M.E.G. and K.R.O.
  {
    id: "relation-kro-meg",
    factionA: "kro",
    factionB: "meg",
    
    status: "Friendly",
    established: "1988",
    firstContact: "1985",
    lastUpdated: "2024",
    
    perspectives: {
      factionA: {
        viewpoint: "M.E.G. provides essential field support and resources that enable our research. While they sometimes prioritize military applications over pure science, the partnership benefits humanity's understanding of the Backrooms.",
        significantEvents: [
          {
            event: "Research Alliance Formalized (1988)",
            reason: "Transformed ad-hoc cooperation into structured partnership. Gave us stable funding and field access."
          },
          {
            event: "Entity Classification Project (2005)",
            reason: "Joint effort produced the standard entity taxonomy used throughout the Backrooms. Our greatest collaborative achievement."
          },
          {
            event: "Level 37 Expedition (2022)",
            reason: "Combined M.E.G. protection with K.R.O. expertise enabled breakthrough discoveries. Model for future cooperation."
          }
        ],
        currentSentiment: "Strong positive relationship built on mutual respect. Minor disagreements about research priorities don't threaten alliance. Both factions benefit significantly - we get field protection and resources, they get scientific insights. Partnership expected to continue indefinitely."
      },
      factionB: {
        viewpoint: "K.R.O. represents the best of Backrooms scholarship. Their rigorous methodology and ethical standards make them ideal research partners. We provide protection; they provide knowledge that saves lives.",
        significantEvents: [
          {
            event: "Research Alliance Formalized (1988)",
            reason: "Smart strategic decision. K.R.O. expertise has saved countless M.E.G. operatives through better understanding of threats."
          },
          {
            event: "Smiler Countermeasures (2010)",
            reason: "K.R.O. research led to effective Smiler deterrents. Directly reduced operative casualties by 40%."
          },
          {
            event: "Joint Training Program (2020)",
            reason: "K.R.O. scientists now receive M.E.G. survival training. Our operatives receive scientific method training. Mutual improvement."
          }
        ],
        currentSentiment: "K.R.O. is our most valued research partner. Their neutrality in faction conflicts makes collaboration uncomplicated. Occasional disagreements about operational security don't threaten the relationship. We actively protect K.R.O. assets as if they were our own."
      }
    },
    
    sharedHistory: {
      rootCause: "Natural alignment between M.E.G.'s operational needs and K.R.O.'s research capabilities. Both organizations recognized mutual benefits early and have maintained cooperative relationship through consistent positive interactions.",
      majorEvents: [
        {
          year: "1985",
          month: null,
          event: "First Contact",
          description: "M.E.G. patrol discovers K.R.O. research outpost. Initial wariness gives way to information exchange.",
          outcome: "Informal cooperation begins.",
          impact: "Foundation for future alliance laid."
        },
        {
          year: "1988",
          month: "April",
          event: "Research Alliance Formalized",
          description: "Leaders sign cooperation agreement. M.E.G. provides security and resources; K.R.O. shares research findings.",
          outcome: "Official partnership established.",
          impact: "Both organizations strengthen significantly."
        },
        {
          year: "2005",
          month: null,
          event: "Entity Classification Project",
          description: "Three-year joint effort to standardize entity documentation.",
          outcome: "Published comprehensive entity taxonomy adopted Backrooms-wide.",
          impact: "Cemented K.R.O. as premier research organization with M.E.G. endorsement."
        },
        {
          year: "2010",
          month: null,
          event: "Smiler Countermeasures Developed",
          description: "K.R.O. research into Smiler behavior leads to effective deterrents.",
          outcome: "M.E.G. casualty rates from Smiler encounters drop 40%.",
          impact: "Demonstrated concrete value of research partnership."
        },
        {
          year: "2020",
          month: "January",
          event: "Joint Training Program",
          description: "Exchange program established. Scientists learn survival; operatives learn research methods.",
          outcome: "Both organizations develop more capable personnel.",
          impact: "Deepened integration between organizations."
        },
        {
          year: "2022",
          month: "August",
          event: "Level 37 Expedition",
          description: "Major joint expedition to previously unexplored level. M.E.G. security, K.R.O. science.",
          outcome: "Significant discoveries about Level 37 properties and entities.",
          impact: "Model for future large-scale joint operations."
        }
      ]
    },
    
    encounterBehavior: {
      civilizedPublicSpaces: "Cordial greetings and open communication. Often share information freely. May collaborate spontaneously on problems.",
      factionATerritory: "M.E.G. members welcomed as honored guests. Full facility access. Discounts on supplies and services.",
      factionBTerritory: "K.R.O. researchers welcomed and protected. Access to research archives. Free lodging at M.E.G. outposts.",
      wilderness: "Join forces immediately against common threats. Share supplies freely. May form impromptu joint expeditions.",
      playerWithAllyCoins: "Both factions accept each other's currency at fair 1:1 rate. Carrying allied currency may result in better treatment and access."
    },
    
    questHooks: [
      "Escort joint research expedition to dangerous level",
      "Recover K.R.O. research data from fallen expedition that M.E.G. couldn't protect",
      "Investigate entity behavior anomaly that threatens both organizations",
      "Mediate minor dispute between K.R.O. purists and M.E.G. pragmatists",
      "Protect K.R.O. researcher who discovered something dangerous factions want",
      "Assist joint training exercise that encounters unexpected threats"
    ],
    
    dmNotes: {
      howToRun: "This is a positive relationship - use it as contrast to hostile faction dynamics. Players helping either faction generally benefit with the other. However, don't make it boring - even allies have disagreements.\n\nK.R.O. sometimes prioritizes pure research over practical application. M.E.G. sometimes wants to weaponize research K.R.O. finds ethically concerning. These tensions create interesting situations without threatening the alliance.",
      commonScenarios: [
        "K.R.O. discovers dangerous knowledge M.E.G. wants to suppress",
        "M.E.G. wants to use research in ways K.R.O. finds unethical",
        "Joint expedition faces threat requiring difficult choices",
        "Outside faction tries to drive wedge between allies",
        "Resource shortage forces prioritization between research and operations"
      ],
      balanceTips: "The alliance should feel stable but not invulnerable. Major betrayal or catastrophe could damage it. Player actions might strengthen or strain the relationship. Keep it feeling real by including minor friction alongside major cooperation."
    },
    
    tags: ["alliance", "research", "stable", "cooperative"],
    sessionVisibility: {}
  }
];

export default data;