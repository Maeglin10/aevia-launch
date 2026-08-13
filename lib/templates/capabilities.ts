// Ce que chaque thème sait afficher, et donc ce que le wizard doit demander.
//
// Généré par analyse statique des 373 thèmes le 2026-08-03 : constantes nommées
// (SERVICES_DEMO, AVIS_DEMO, TARIFS…) et sections écrites directement dans le
// JSX. Les thèmes déclarent 432 noms de constantes différents pour les mêmes
// concepts, d'où cette table : elle donne un vocabulaire unique par-dessus.
//
// Le principe : un client choisit un thème parce qu'il montre ce qu'il veut
// montrer. S'il prend un thème avec une section « zones d'intervention », le
// wizard doit lui demander ses zones — sinon la section restera celle de la
// démonstration, quel que soit le câblage.
//
// Régénérer après ajout de thèmes : voir docs/PLAN_CONTRAT_CONTENU.md.

export type ContentBlock =
  | "prestations"
  | "avis"
  | "engagements"
  | "chiffres"
  | "methode"
  | "tarifs"
  | "realisations"
  | "faq"
  | "equipe"
  | "horaires"
  | "menu"
  | "produits"
  | "zones";

/** Demandé à tous, quel que soit le thème. */
/*
  Le socle est vide.

  « prestations » y figurait, ce qui le faisait déclarer par les 373 thèmes sans
  qu'aucun ne l'ait vérifié — y compris ceux qui n'affichent pas de section
  prestations du tout. Le compteur des défauts en était gonflé de 31, et le
  wizard demandait des prestations à des clients dont le thème n'en montrerait
  aucune. Chaque bloc est maintenant déclaré par thème, sur preuve.
*/
export const SOCLE: ContentBlock[] = [];

/*
  Deux signaux, pas un.

  Ce manifeste était bâti sur les seuls noms de constantes, et il sur-déclarait :
  67 thèmes annonçaient des « engagements » sans en porter le moindre
  vocabulaire, et 15 des 18 thèmes annonçant des « zones » n'en affichaient
  aucune. Le wizard demandait donc au client des garanties et des communes que
  son thème n'aurait jamais montrées — du temps pris pour rien, et un rappel
  d'aperçu qui pointait des sections inexistantes.

  Cinquième et dernier resserrement des engagements, celui-là fait à l'œil : sur
  les 23 thèmes restants, le vocabulaire vivait dans une liste de prestations
  (« installation certifiée RGE »), dans un chiffre clé (« Garantie décennale »
  comme libellé) ou dans de la prose — une toile « d'une assurance rare ». Vingt
  et une déclarations retirées, deux vraies listes câblées. Aucune heuristique
  n'y arrivait : il fallait regarder.

  Les avis suivent la même exigence : il faut une ligne portant à la fois un
  texte long et un attributaire — un nom, un rôle, une ville. 45 thèmes
  annonçaient des avis sans jamais en structurer un seul.

  Une seule phrase ne fait pas une section. Le mot « garantie » se trouve aussi
  au détour d'une prestation ou d'une réponse de FAQ ; une vraie section
  d'engagements en aligne plusieurs. On exige donc trois phrases distinctes.

  Le vocabulaire lui-même doit être précis. Sans limites de mots, « RGE » et
  « label » se retrouvaient à l'intérieur d'autres mots et 21 thèmes de plus
  étaient déclarés à tort. L'instrument de mesure était le défaut.

  Pour les engagements, le vocabulaire ne suffit pas non plus : « garantie » ou
  « RGE » apparaît aussi dans un libellé de navigation ou dans un chiffre clé
  (« 10 ans / Garantie décennale »). Une garantie est une phrase — on exige donc
  qu'elle tienne en au moins 25 caractères. 49 déclarations de plus retirées à ce
  titre, après les 64 du premier resserrement.

  Ces quatre blocs exigent maintenant aussi la présence du vocabulaire
  correspondant dans les chaînes du thème. Les autres gardent le seul signal du
  nom : leur test de vocabulaire s'est révélé trop imprécis pour arbitrer — sur
  les avis, il écartait 211 thèmes dont beaucoup en affichent réellement.
*/

export const THEME_BLOCKS: Record<string, ContentBlock[]> = {
  "impact-01": ["chiffres", "equipe", "horaires", "methode", "prestations", "realisations"],
  "impact-02": ["avis", "methode", "prestations", "realisations", "faq"],
  "impact-03": ["methode", "prestations", "produits", "realisations", "tarifs"],
  "impact-04": ["avis", "chiffres", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-05": ["avis", "chiffres", "faq", "prestations", "realisations", "tarifs"],
  "impact-06": ["avis", "chiffres", "prestations", "produits", "realisations", "tarifs"],
  "impact-07": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-08": ["chiffres", "prestations", "produits"],
  "impact-09": ["methode", "prestations"],
  "impact-10": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-11": ["chiffres", "equipe", "prestations", "tarifs"],
  "impact-12": ["horaires", "methode", "prestations", "produits", "realisations", "tarifs"],
  "impact-13": ["chiffres", "horaires", "methode", "prestations", "produits", "realisations", "tarifs"],
  "impact-14": ["avis", "chiffres", "methode", "prestations", "realisations", "tarifs"],
  "impact-15": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-16": ["engagements", "prestations", "realisations", "tarifs"],
  "impact-17": ["chiffres", "equipe", "horaires", "methode", "prestations", "realisations"],
  "impact-18": ["avis", "chiffres", "faq", "prestations", "tarifs"],
  "impact-19": ["chiffres", "equipe", "prestations", "realisations"],
  "impact-20": ["avis", "prestations", "produits", "realisations", "tarifs"],
  "impact-21": ["chiffres", "engagements", "methode", "prestations", "realisations", "tarifs"],
  "impact-22": ["faq", "prestations", "tarifs"],
  "impact-23": ["prestations", "realisations"],
  "impact-24": ["equipe", "faq", "horaires", "prestations", "realisations"],
  "impact-25": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-26": ["avis", "chiffres", "methode", "prestations", "produits", "tarifs"],
  "impact-27": ["avis", "chiffres", "engagements", "equipe", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-28": ["avis", "equipe", "horaires", "methode", "prestations", "realisations"],
  "impact-29": ["methode", "realisations"],
  "impact-30": ["avis", "chiffres", "equipe", "faq", "prestations", "tarifs"],
  "impact-31": ["avis", "chiffres", "faq", "horaires", "prestations", "tarifs", "equipe"],
  "impact-32": ["avis", "chiffres", "equipe", "faq", "horaires", "methode", "prestations", "tarifs"],
  "impact-33": ["avis", "chiffres", "faq", "horaires", "prestations", "produits", "tarifs"],
  "impact-34": ["chiffres", "prestations", "tarifs"],
  "impact-35": ["avis", "equipe", "prestations", "tarifs"],
  "impact-36": ["realisations", "prestations"],
  "impact-37": ["avis", "chiffres", "faq", "horaires", "menu"],
  "impact-38": ["avis", "chiffres", "faq", "horaires", "menu", "methode", "prestations", "produits", "tarifs"],
  "impact-39": ["chiffres", "methode"],
  "impact-40": ["avis", "chiffres", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-41": [],
  "impact-42": ["avis", "chiffres", "equipe", "faq", "horaires", "prestations", "tarifs"],
  "impact-43": ["avis", "equipe", "methode", "prestations", "tarifs"],
  "impact-44": ["methode"],
  "impact-45": ["realisations", "prestations"],
  "impact-46": ["avis", "equipe", "faq", "horaires", "prestations", "realisations", "tarifs"],
  "impact-47": ["avis", "chiffres", "faq", "horaires", "prestations", "produits", "tarifs"],
  "impact-48": ["chiffres", "equipe", "methode", "prestations", "realisations"],
  "impact-49": ["avis", "chiffres", "methode", "prestations", "tarifs"],
  "impact-50": ["avis", "chiffres", "prestations"],
  "impact-51": [],
  "impact-52": ["prestations", "realisations"],
  "impact-53": ["prestations", "realisations"],
  "impact-54": ["prestations", "tarifs"],
  "impact-55": ["avis", "chiffres", "equipe", "prestations", "engagements"],
  "impact-56": ["methode", "prestations", "tarifs"],
  "impact-57": ["avis", "methode", "prestations", "realisations", "engagements"],
  "impact-58": ["chiffres", "equipe", "prestations", "realisations"],
  "impact-59": ["avis", "chiffres", "methode", "prestations", "tarifs"],
  "impact-60": ["avis", "prestations", "tarifs"],
  "impact-61": ["prestations", "realisations"],
  "impact-62": ["avis", "chiffres", "menu", "methode", "prestations"],
  "impact-63": [],
  "impact-64": ["methode", "prestations", "tarifs"],
  "impact-65": ["avis", "prestations", "produits"],
  "impact-66": ["chiffres", "methode", "prestations", "tarifs"],
  "impact-67": ["chiffres", "methode", "prestations", "tarifs"],
  "impact-68": ["chiffres", "methode", "prestations", "realisations", "tarifs"],
  "impact-69": ["chiffres"],
  "impact-70": ["avis", "chiffres"],
  "impact-71": ["avis", "chiffres", "methode", "prestations"],
  "impact-72": ["methode", "prestations"],
  "impact-73": ["avis", "chiffres", "methode", "prestations", "tarifs"],
  "impact-74": ["avis", "chiffres", "menu", "methode", "prestations", "realisations", "tarifs"],
  "impact-75": ["chiffres", "faq", "methode", "prestations", "produits", "realisations", "tarifs"],
  "impact-76": ["chiffres", "methode", "prestations", "realisations", "equipe"],
  "impact-77": ["avis", "methode", "prestations", "realisations", "tarifs"],
  "impact-78": ["avis", "chiffres", "methode", "prestations", "realisations", "tarifs"],
  "impact-79": ["chiffres", "methode", "prestations", "produits", "realisations", "tarifs"],
  "impact-80": ["chiffres", "methode", "prestations", "realisations", "faq", "equipe"],
  "impact-81": ["avis"],
  "impact-82": ["avis", "equipe", "realisations"],
  "impact-83": ["avis", "equipe", "methode", "prestations", "tarifs"],
  "impact-84": ["avis", "equipe", "prestations", "tarifs"],
  "impact-85": ["avis", "faq", "methode", "prestations", "produits", "tarifs"],
  "impact-86": ["avis", "equipe", "faq", "horaires", "prestations", "tarifs"],
  "impact-87": ["horaires"],
  "impact-88": ["avis", "faq", "horaires", "methode", "prestations", "realisations", "tarifs", "equipe"],
  "impact-89": ["avis", "chiffres", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-90": ["avis", "faq", "horaires", "methode", "prestations", "tarifs"],
  "impact-91": ["avis", "chiffres", "faq", "horaires", "prestations", "tarifs"],
  "impact-92": ["avis", "chiffres", "faq", "prestations", "realisations", "tarifs"],
  "impact-93": ["avis", "chiffres", "faq", "prestations", "realisations"],
  "impact-94": ["avis", "chiffres", "faq", "horaires", "methode", "prestations", "realisations", "tarifs"],
  "impact-95": ["chiffres", "equipe", "faq", "horaires", "prestations", "tarifs"],
  "impact-96": ["avis", "chiffres", "equipe", "faq", "prestations", "realisations", "tarifs"],
  "impact-97": ["chiffres", "prestations", "tarifs"],
  "impact-98": ["chiffres", "prestations", "realisations", "tarifs"],
  "impact-99": ["chiffres", "horaires", "menu", "prestations", "realisations", "tarifs"],
  "impact-100": ["chiffres", "realisations", "prestations"],
  "impact-101": ["chiffres", "prestations", "realisations"],
  "impact-102": ["chiffres", "equipe", "prestations"],
  "impact-103": ["avis", "equipe", "prestations", "realisations"],
  "impact-104": ["prestations", "realisations", "avis"],
  "impact-105": ["avis", "chiffres", "prestations"],
  "impact-106": ["equipe", "realisations", "prestations"],
  "impact-107": ["avis", "prestations"],
  "impact-108": ["horaires"],
  "impact-109": ["avis", "prestations", "produits", "realisations", "tarifs"],
  "impact-110": ["avis", "prestations", "tarifs"],
  "impact-111": ["equipe", "prestations", "realisations"],
  "impact-112": ["chiffres", "faq", "methode", "prestations", "produits", "tarifs"],
  "impact-113": ["avis", "prestations", "realisations", "tarifs", "faq"],
  "impact-114": ["chiffres", "methode", "prestations", "realisations", "tarifs"],
  "impact-115": ["chiffres", "prestations", "realisations", "equipe"],
  "impact-116": ["chiffres", "equipe", "methode", "prestations", "realisations", "tarifs"],
  "impact-117": ["prestations", "realisations"],
  "impact-118": ["prestations", "realisations", "tarifs"],
  "impact-119": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-120": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-121": ["prestations", "tarifs"],
  "impact-122": [],
  "impact-123": ["chiffres", "prestations", "realisations"],
  "impact-124": ["prestations", "realisations", "tarifs", "faq"],
  "impact-125": [],
  "impact-126": ["chiffres", "horaires", "menu", "prestations", "tarifs"],
  "impact-127": ["chiffres", "faq", "prestations", "realisations", "tarifs"],
  "impact-128": ["avis", "prestations", "realisations", "tarifs"],
  "impact-129": ["avis", "chiffres", "equipe", "prestations"],
  "impact-130": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-131": ["chiffres", "prestations", "tarifs"],
  "impact-132": [],
  "impact-133": ["avis", "chiffres", "prestations", "realisations"],
  "impact-134": ["avis", "methode", "prestations", "produits", "tarifs"],
  "impact-135": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-136": ["methode", "prestations", "realisations"],
  "impact-137": ["methode", "prestations", "tarifs"],
  "impact-138": ["avis", "chiffres", "engagements", "prestations", "tarifs"],
  "impact-139": ["avis", "equipe", "prestations", "realisations", "tarifs"],
  "impact-140": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-141": ["realisations"],
  "impact-142": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-143": ["avis", "prestations", "realisations"],
  "impact-144": ["avis", "prestations", "realisations"],
  "impact-145": ["avis", "prestations", "realisations", "tarifs"],
  "impact-146": [],
  "impact-147": ["equipe", "avis", "prestations"],
  "impact-148": ["prestations", "realisations", "tarifs"],
  "impact-149": ["avis", "prestations", "tarifs"],
  "impact-150": ["avis", "chiffres", "equipe", "methode", "prestations", "realisations", "tarifs"],
  "impact-151": ["chiffres", "prestations", "realisations", "tarifs"],
  "impact-152": ["avis", "chiffres", "prestations", "realisations"],
  "impact-153": ["prestations", "tarifs"],
  "impact-154": ["chiffres", "horaires", "prestations", "realisations"],
  "impact-155": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-156": ["avis", "chiffres", "horaires", "prestations", "tarifs"],
  "impact-157": ["avis", "chiffres", "engagements", "faq", "prestations", "realisations", "tarifs"],
  "impact-158": ["chiffres"],
  "impact-159": ["chiffres", "prestations"],
  "impact-160": ["chiffres"],
  "impact-161": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-162": ["avis", "horaires", "menu", "realisations"],
  "impact-163": ["avis", "chiffres", "faq", "methode", "prestations", "tarifs", "equipe"],
  "impact-164": ["avis", "chiffres", "equipe", "faq", "prestations", "realisations", "tarifs"],
  "impact-165": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-166": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-167": ["avis", "chiffres", "methode", "zones"],
  "impact-168": ["avis", "chiffres", "faq", "horaires", "prestations", "produits", "realisations", "tarifs"],
  "impact-169": ["avis", "chiffres", "equipe", "faq", "prestations", "tarifs"],
  "impact-170": ["chiffres", "methode", "prestations", "realisations"],
  "impact-171": ["avis", "equipe", "horaires", "methode", "prestations", "tarifs"],
  "impact-172": ["prestations", "equipe"],
  "impact-173": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-174": ["chiffres", "equipe", "horaires", "prestations", "tarifs"],
  "impact-175": ["avis", "chiffres", "methode", "prestations", "realisations"],
  "impact-176": ["avis", "chiffres", "faq", "methode", "prestations", "tarifs"],
  "impact-177": ["avis", "prestations", "realisations"],
  "impact-178": ["avis", "prestations", "realisations", "tarifs"],
  "impact-179": ["avis", "prestations", "realisations", "tarifs", "zones"],
  "impact-180": ["avis", "prestations", "realisations", "zones"],
  "impact-181": ["avis", "prestations", "realisations", "zones"],
  "impact-182": ["avis", "prestations", "realisations", "zones"],
  "impact-183": ["avis", "prestations", "realisations", "zones"],
  "impact-184": ["methode", "prestations", "tarifs", "zones"],
  "impact-185": ["prestations", "tarifs"],
  "impact-186": ["avis", "equipe", "prestations", "tarifs"],
  "impact-187": ["methode", "prestations", "tarifs"],
  "impact-188": ["equipe", "horaires", "prestations", "tarifs", "avis"],
  "impact-189": ["equipe", "prestations", "realisations", "tarifs", "avis"],
  "impact-190": ["equipe", "prestations"],
  "impact-191": ["prestations", "realisations", "zones", "avis"],
  "impact-192": ["avis", "prestations", "tarifs", "zones"],
  "impact-193": ["avis", "horaires", "prestations", "tarifs"],
  "impact-194": ["menu", "prestations", "realisations"],
  "impact-195": ["equipe", "prestations", "realisations"],
  "impact-196": ["avis", "chiffres", "prestations"],
  "impact-197": ["avis", "chiffres", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-198": ["avis", "chiffres", "equipe", "prestations", "tarifs"],
  "impact-199": ["avis", "chiffres", "equipe", "faq", "horaires", "methode", "prestations", "realisations", "tarifs"],
  "impact-200": ["avis", "chiffres", "horaires", "methode", "prestations", "realisations", "tarifs"],
  "impact-201": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-207": ["avis", "chiffres", "prestations"],
  "impact-208": ["chiffres", "equipe", "horaires", "prestations", "realisations"],
  "impact-209": ["avis", "chiffres", "equipe", "methode", "prestations", "realisations", "tarifs"],
  "impact-210": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-211": ["chiffres", "horaires", "prestations", "tarifs"],
  "impact-212": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations"],
  "impact-213": ["avis", "chiffres", "equipe", "faq", "horaires", "methode", "prestations", "realisations", "tarifs"],
  "impact-214": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations"],
  "impact-215": ["avis", "chiffres", "faq", "methode", "prestations", "produits", "tarifs"],
  "impact-216": ["avis", "chiffres", "faq", "horaires", "prestations", "tarifs"],
  "impact-217": ["avis", "methode", "prestations", "produits", "tarifs"],
  "impact-218": ["avis", "prestations", "realisations"],
  "impact-219": ["chiffres", "equipe", "faq", "prestations", "realisations", "tarifs"],
  "impact-220": ["avis", "chiffres", "methode", "prestations", "realisations"],
  "impact-221": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-222": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-223": ["avis", "methode", "prestations", "realisations"],
  "impact-226": ["avis", "chiffres", "methode", "prestations", "realisations", "tarifs"],
  "impact-227": ["avis", "chiffres", "equipe", "prestations", "tarifs"],
  "impact-228": ["avis", "chiffres", "engagements", "prestations", "tarifs"],
  "impact-229": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-230": ["avis", "chiffres", "realisations", "engagements", "prestations"],
  "impact-231": ["avis", "chiffres", "methode", "prestations", "tarifs"],
  "impact-232": ["avis", "chiffres", "engagements", "prestations", "tarifs"],
  "impact-233": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-235": ["realisations", "avis", "prestations"],
  "impact-236": ["avis", "prestations", "realisations"],
  "impact-237": ["avis", "prestations", "tarifs"],
  "impact-238": ["avis", "methode", "prestations", "tarifs"],
  "impact-239": ["avis", "prestations", "realisations", "tarifs"],
  "impact-240": ["methode", "prestations", "avis"],
  "impact-241": ["avis", "prestations", "tarifs"],
  "impact-242": ["avis", "prestations"],
  "impact-243": ["avis", "prestations"],
  "impact-244": ["avis", "prestations"],
  "impact-245": ["avis"],
  "impact-246": ["prestations", "avis"],
  "impact-247": ["avis", "prestations"],
  "impact-248": ["avis", "prestations"],
  "impact-249": ["avis", "prestations", "equipe"],
  "impact-250": ["avis", "prestations", "realisations"],
  "impact-251": ["avis", "prestations"],
  "impact-252": ["avis", "prestations"],
  "impact-253": ["avis", "methode", "prestations"],
  "impact-254": ["avis", "prestations"],
  "impact-255": ["avis", "prestations"],
  "impact-256": ["avis", "methode", "prestations", "tarifs"],
  "impact-257": ["avis", "prestations"],
  "impact-258": ["avis", "prestations"],
  "impact-259": ["avis", "menu", "prestations"],
  "impact-260": ["avis", "prestations"],
  "impact-261": ["avis", "prestations"],
  "impact-262": ["avis", "chiffres", "equipe", "prestations"],
  "impact-263": ["avis", "prestations", "realisations"],
  "impact-264": ["avis", "prestations"],
  "impact-265": ["avis", "prestations"],
  "impact-266": ["avis", "prestations"],
  "impact-267": ["avis", "prestations", "equipe"],
  "impact-268": ["methode", "prestations", "avis"],
  "impact-269": ["avis", "prestations"],
  "impact-270": ["avis", "prestations", "equipe"],
  "impact-271": ["avis", "prestations"],
  "impact-272": ["avis", "methode", "prestations"],
  "impact-273": ["avis", "prestations"],
  "impact-274": ["avis", "equipe", "horaires", "prestations", "realisations"],
  "impact-275": ["avis", "chiffres", "methode", "prestations"],
  "impact-276": ["avis", "chiffres", "horaires", "methode", "prestations", "tarifs"],
  "impact-277": ["avis", "methode", "prestations", "realisations", "engagements"],
  "impact-278": ["avis", "methode", "prestations", "realisations"],
  "impact-279": ["avis", "prestations", "tarifs"],
  "impact-280": ["avis", "methode", "prestations", "realisations", "tarifs"],
  "impact-281": ["avis", "methode", "prestations", "tarifs"],
  "impact-282": ["avis", "horaires", "menu", "methode", "prestations", "tarifs"],
  "impact-283": ["avis", "chiffres", "equipe", "horaires", "prestations"],
  "impact-284": ["avis", "chiffres", "equipe", "prestations", "tarifs"],
  "impact-285": ["avis", "equipe", "horaires", "prestations", "tarifs"],
  "impact-286": ["avis", "chiffres", "methode", "prestations"],
  "impact-287": ["avis", "chiffres", "horaires", "methode", "prestations", "tarifs"],
  "impact-288": ["avis", "engagements", "methode", "prestations"],
  "impact-289": ["avis", "chiffres", "methode", "prestations"],
  "impact-290": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-291": ["avis", "prestations", "tarifs"],
  "impact-292": ["avis", "faq", "horaires", "menu"],
  "impact-293": ["avis", "faq", "horaires", "menu"],
  "impact-294": ["avis", "faq", "horaires", "menu"],
  "impact-295": ["avis", "faq", "horaires", "menu"],
  "impact-296": ["avis", "faq", "horaires", "menu"],
  "impact-297": ["faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-298": ["faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-299": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-300": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-301": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-302": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-303": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-304": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-305": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-306": ["avis", "faq", "horaires", "menu"],
  "impact-307": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-308": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-309": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-310": ["avis", "faq", "horaires", "menu", "prestations", "realisations", "tarifs"],
  "impact-311": ["avis", "faq", "horaires", "prestations", "tarifs"],
  "impact-312": ["avis", "chiffres", "faq", "horaires", "prestations"],
  "impact-313": ["avis", "faq", "prestations", "realisations"],
  "impact-314": ["avis", "faq", "prestations", "realisations"],
  "impact-315": ["avis", "chiffres", "engagements", "faq", "horaires", "prestations", "tarifs"],
  "impact-316": ["avis", "chiffres", "engagements", "faq", "horaires", "prestations"],
  "impact-317": ["avis", "chiffres", "faq", "horaires", "methode", "prestations", "tarifs"],
  "impact-318": ["avis", "chiffres", "engagements", "faq", "methode", "prestations", "tarifs"],
  "impact-319": ["avis", "chiffres", "faq", "prestations", "tarifs"],
  "impact-321": ["chiffres", "equipe", "faq", "prestations", "tarifs"],
  "impact-322": ["avis", "chiffres", "engagements", "prestations", "realisations", "tarifs"],
  "impact-324": ["avis", "chiffres", "engagements", "prestations", "realisations", "tarifs"],
  "impact-325": ["chiffres", "engagements", "equipe", "prestations", "realisations", "tarifs"],
  "impact-326": ["avis", "chiffres", "engagements", "prestations", "tarifs"],
  "impact-327": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-328": ["avis", "prestations", "tarifs", "engagements"],
  "impact-329": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-330": ["avis", "prestations", "engagements"],
  "impact-331": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-332": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-333": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-334": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-335": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-336": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-337": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-338": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-339": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-340": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-341": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-342": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-343": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-344": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-345": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-346": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-347": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-348": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-349": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-350": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-351": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-352": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-353": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-354": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-355": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-356": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-357": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-358": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-359": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-360": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-361": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-362": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-363": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-364": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-365": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-366": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-367": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs", "zones"],
  "impact-368": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-369": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-370": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-371": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-372": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-373": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-374": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-375": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-376": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-377": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-378": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-379": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-380": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-381": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-382": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-383": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
};

/**
 * Les blocs à demander pour un thème : son propre jeu, plus le socle.
 * Un thème inconnu retombe sur le socle seul — on préfère demander trop peu
 * que d'inventer une section que le thème ne sait pas afficher.
 */
export function blocksForTheme(templateId: string | undefined): ContentBlock[] {
  const own = (templateId && THEME_BLOCKS[templateId]) || [];
  return Array.from(new Set([...SOCLE, ...own]));
}
