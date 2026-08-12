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
  "impact-01": ["chiffres", "methode", "prestations", "realisations"],
  "impact-02": ["avis", "methode", "prestations", "realisations", "faq"],
  "impact-03": ["methode", "produits", "realisations", "prestations"],
  "impact-04": ["avis", "chiffres", "faq", "menu", "tarifs"],
  "impact-05": ["avis", "chiffres", "faq", "prestations", "realisations", "tarifs"],
  "impact-06": ["avis", "chiffres", "prestations", "produits", "realisations"],
  "impact-07": ["avis", "chiffres", "prestations", "realisations"],
  "impact-08": ["prestations", "produits"],
  "impact-09": ["methode", "prestations"],
  "impact-10": ["avis", "chiffres", "prestations"],
  "impact-11": ["prestations", "tarifs", "equipe"],
  "impact-12": ["horaires", "methode", "realisations", "prestations", "produits"],
  "impact-13": ["methode", "realisations", "prestations", "produits"],
  "impact-14": ["avis", "chiffres", "methode", "prestations"],
  "impact-15": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-16": ["realisations", "engagements", "prestations"],
  "impact-17": ["horaires", "methode", "prestations", "realisations", "equipe"],
  "impact-18": ["faq", "prestations"],
  "impact-19": ["prestations", "realisations", "equipe"],
  "impact-20": ["avis", "produits", "prestations"],
  "impact-21": ["methode", "prestations", "realisations", "engagements"],
  "impact-22": ["faq", "prestations"],
  "impact-23": ["prestations", "realisations"],
  "impact-24": ["prestations", "realisations", "faq", "equipe"],
  "impact-25": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-26": ["avis", "methode", "prestations", "produits"],
  "impact-27": ["avis", "chiffres", "methode", "prestations", "realisations", "equipe", "faq", "engagements"],
  "impact-28": ["methode", "prestations", "realisations", "avis", "equipe"],
  "impact-29": ["methode", "realisations"],
  "impact-30": ["avis", "chiffres", "equipe", "faq", "prestations", "tarifs"],
  "impact-31": ["avis", "chiffres", "faq", "horaires", "prestations", "tarifs", "equipe"],
  "impact-32": ["avis", "chiffres", "equipe", "faq", "horaires", "methode", "prestations", "tarifs"],
  "impact-33": ["avis", "chiffres", "faq", "horaires", "produits", "prestations"],
  "impact-34": ["prestations"],
  "impact-35": ["prestations", "avis", "equipe"],
  "impact-36": ["realisations", "prestations"],
  "impact-37": ["avis", "horaires", "menu", "faq"],
  "impact-38": ["avis", "chiffres", "horaires", "menu", "methode", "produits", "prestations", "faq"],
  "impact-39": ["chiffres", "methode"],
  "impact-40": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-41": [],
  "impact-42": ["prestations", "tarifs", "faq", "avis", "equipe"],
  "impact-43": ["equipe", "methode", "avis", "prestations"],
  "impact-44": ["methode"],
  "impact-45": ["realisations", "prestations"],
  "impact-46": ["faq", "prestations", "realisations", "avis", "equipe"],
  "impact-47": ["avis", "faq", "produits", "prestations"],
  "impact-48": ["equipe", "methode", "prestations", "realisations"],
  "impact-49": ["avis", "methode", "prestations"],
  "impact-50": ["avis", "chiffres", "prestations"],
  "impact-51": [],
  "impact-52": ["prestations", "realisations"],
  "impact-53": ["prestations", "realisations"],
  "impact-54": ["prestations", "tarifs"],
  "impact-55": ["avis", "chiffres", "equipe", "prestations", "engagements"],
  "impact-56": ["methode", "prestations"],
  "impact-57": ["avis", "methode", "prestations", "realisations", "engagements"],
  "impact-58": ["chiffres", "equipe", "prestations", "realisations"],
  "impact-59": ["avis", "chiffres", "methode", "prestations"],
  "impact-60": ["avis", "prestations"],
  "impact-61": ["prestations", "realisations"],
  "impact-62": ["avis", "menu", "methode", "prestations"],
  "impact-63": [],
  "impact-64": ["methode", "prestations"],
  "impact-65": ["avis", "prestations", "produits"],
  "impact-66": ["chiffres", "methode", "prestations"],
  "impact-67": ["methode", "prestations"],
  "impact-68": ["methode", "prestations", "realisations"],
  "impact-69": ["chiffres"],
  "impact-70": ["avis"],
  "impact-71": ["avis", "methode", "prestations"],
  "impact-72": ["methode", "prestations"],
  "impact-73": ["avis", "chiffres", "methode", "prestations", "tarifs"],
  "impact-74": ["avis", "menu", "methode", "realisations", "prestations"],
  "impact-75": ["faq", "methode", "prestations", "produits"],
  "impact-76": ["chiffres", "methode", "prestations", "realisations", "equipe"],
  "impact-77": ["avis", "methode", "prestations", "tarifs"],
  "impact-78": ["avis", "chiffres", "methode", "prestations"],
  "impact-79": ["methode", "prestations", "produits"],
  "impact-80": ["chiffres", "methode", "prestations", "realisations", "faq", "equipe"],
  "impact-81": ["avis"],
  "impact-82": ["avis", "equipe", "realisations"],
  "impact-83": ["avis", "equipe", "methode", "prestations"],
  "impact-84": ["avis", "prestations", "equipe"],
  "impact-85": ["avis", "faq", "methode", "produits", "prestations"],
  "impact-86": ["avis", "equipe", "faq", "horaires", "prestations"],
  "impact-87": ["horaires"],
  "impact-88": ["avis", "faq", "horaires", "methode", "prestations", "realisations", "tarifs", "equipe"],
  "impact-89": ["avis", "chiffres", "faq", "methode", "prestations", "realisations"],
  "impact-90": ["avis", "faq", "horaires", "methode", "prestations"],
  "impact-91": ["avis", "chiffres", "faq", "prestations"],
  "impact-92": ["avis", "chiffres", "faq", "prestations"],
  "impact-93": ["avis", "faq", "prestations", "realisations"],
  "impact-94": ["avis", "chiffres", "faq", "horaires", "methode", "realisations", "prestations"],
  "impact-95": ["equipe", "faq", "horaires", "tarifs"],
  "impact-96": ["avis", "chiffres", "faq", "prestations", "realisations", "tarifs"],
  "impact-97": ["chiffres", "prestations", "tarifs"],
  "impact-98": ["chiffres", "realisations", "prestations"],
  "impact-99": ["chiffres", "horaires", "menu", "prestations"],
  "impact-100": ["chiffres", "realisations", "prestations"],
  "impact-101": ["chiffres", "prestations", "realisations"],
  "impact-102": ["chiffres", "equipe", "prestations"],
  "impact-103": ["avis", "equipe", "prestations", "realisations"],
  "impact-104": ["prestations", "realisations", "avis"],
  "impact-105": ["avis", "chiffres", "prestations"],
  "impact-106": ["equipe", "realisations", "prestations"],
  "impact-107": ["avis", "prestations"],
  "impact-108": ["horaires"],
  "impact-109": ["avis", "produits", "prestations"],
  "impact-110": ["avis", "prestations"],
  "impact-111": ["equipe", "prestations", "realisations"],
  "impact-112": ["faq", "methode", "prestations", "produits", "tarifs"],
  "impact-113": ["avis", "prestations", "realisations", "tarifs", "faq"],
  "impact-114": ["chiffres", "methode", "prestations", "realisations"],
  "impact-115": ["chiffres", "prestations", "realisations", "equipe"],
  "impact-116": ["chiffres", "equipe", "methode", "prestations", "realisations", "tarifs"],
  "impact-117": ["prestations"],
  "impact-118": ["prestations", "realisations"],
  "impact-119": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-120": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-121": ["prestations", "tarifs"],
  "impact-122": [],
  "impact-123": ["realisations", "prestations"],
  "impact-124": ["prestations", "realisations", "tarifs", "faq"],
  "impact-125": [],
  "impact-126": ["horaires", "menu", "prestations"],
  "impact-127": ["chiffres", "faq", "prestations"],
  "impact-128": ["avis", "prestations", "realisations"],
  "impact-129": ["avis", "chiffres", "equipe", "prestations"],
  "impact-130": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations"],
  "impact-131": ["chiffres", "prestations"],
  "impact-132": [],
  "impact-133": ["avis", "prestations", "realisations"],
  "impact-134": ["avis", "methode", "prestations", "produits"],
  "impact-135": ["avis", "chiffres", "prestations", "realisations", "tarifs"],
  "impact-136": ["methode", "prestations", "realisations"],
  "impact-137": ["methode", "tarifs"],
  "impact-138": ["avis", "chiffres", "engagements", "prestations"],
  "impact-139": ["equipe", "prestations", "tarifs", "avis"],
  "impact-140": ["avis", "prestations"],
  "impact-141": [],
  "impact-142": ["avis", "prestations", "tarifs"],
  "impact-143": ["avis", "prestations", "realisations"],
  "impact-144": ["avis", "prestations"],
  "impact-145": ["avis", "realisations", "prestations"],
  "impact-146": [],
  "impact-147": ["equipe", "avis", "prestations"],
  "impact-148": ["realisations", "prestations"],
  "impact-149": ["avis", "prestations"],
  "impact-150": ["methode", "realisations", "avis", "prestations", "equipe"],
  "impact-151": ["prestations"],
  "impact-152": ["avis", "chiffres", "prestations", "realisations"],
  "impact-153": ["prestations"],
  "impact-154": ["prestations", "realisations"],
  "impact-155": ["avis", "chiffres", "prestations"],
  "impact-156": ["avis", "chiffres", "tarifs"],
  "impact-157": ["avis", "chiffres", "engagements", "faq", "prestations", "realisations"],
  "impact-158": [],
  "impact-159": ["chiffres", "prestations"],
  "impact-160": [],
  "impact-161": ["avis", "prestations", "tarifs"],
  "impact-162": ["avis", "horaires", "menu", "realisations"],
  "impact-163": ["avis", "chiffres", "faq", "methode", "prestations", "tarifs", "equipe"],
  "impact-164": ["avis", "chiffres", "equipe", "faq", "realisations", "tarifs"],
  "impact-165": ["avis", "prestations", "tarifs"],
  "impact-166": ["avis", "prestations"],
  "impact-167": ["avis", "chiffres", "methode"],
  "impact-168": ["avis", "chiffres", "faq", "produits", "realisations", "prestations"],
  "impact-169": ["avis", "chiffres", "faq", "tarifs", "equipe"],
  "impact-170": ["methode", "prestations", "realisations"],
  "impact-171": ["avis", "equipe", "horaires", "methode", "prestations", "tarifs"],
  "impact-172": ["prestations", "equipe"],
  "impact-173": ["avis", "chiffres", "equipe", "faq", "methode", "realisations", "prestations"],
  "impact-174": ["prestations", "equipe"],
  "impact-175": ["avis", "methode", "prestations"],
  "impact-176": ["avis", "chiffres", "faq", "methode", "prestations", "tarifs"],
  "impact-177": ["avis", "prestations", "realisations"],
  "impact-178": ["prestations", "tarifs", "avis"],
  "impact-179": ["prestations", "realisations", "tarifs", "avis"],
  "impact-180": ["prestations", "realisations", "avis"],
  "impact-181": ["prestations", "realisations", "avis"],
  "impact-182": ["avis", "prestations", "realisations"],
  "impact-183": ["prestations", "realisations", "avis"],
  "impact-184": ["methode", "prestations", "tarifs"],
  "impact-185": ["prestations", "tarifs"],
  "impact-186": ["avis", "equipe", "prestations", "tarifs"],
  "impact-187": ["methode", "prestations", "tarifs"],
  "impact-188": ["equipe", "horaires", "prestations", "tarifs", "avis"],
  "impact-189": ["equipe", "prestations", "realisations", "tarifs", "avis"],
  "impact-190": ["equipe", "prestations"],
  "impact-191": ["prestations", "realisations", "zones", "avis"],
  "impact-192": ["prestations", "tarifs", "avis"],
  "impact-193": ["horaires", "tarifs", "avis"],
  "impact-194": ["menu", "prestations", "realisations"],
  "impact-195": ["equipe", "prestations", "realisations"],
  "impact-196": ["avis", "chiffres", "prestations"],
  "impact-197": ["avis", "chiffres", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-198": ["avis", "equipe", "prestations"],
  "impact-199": ["avis", "faq", "methode", "realisations", "tarifs", "equipe"],
  "impact-200": ["avis", "methode", "prestations", "realisations"],
  "impact-201": ["avis", "prestations"],
  "impact-207": ["avis", "prestations"],
  "impact-208": ["chiffres", "equipe", "prestations", "realisations"],
  "impact-209": ["avis", "equipe", "methode", "prestations", "realisations"],
  "impact-210": ["avis", "prestations", "realisations", "tarifs"],
  "impact-211": ["horaires", "prestations"],
  "impact-212": ["avis", "equipe", "faq", "methode", "prestations", "realisations"],
  "impact-213": ["avis", "equipe", "faq", "methode", "prestations", "realisations", "tarifs"],
  "impact-214": ["avis", "chiffres", "equipe", "faq", "methode", "prestations", "realisations"],
  "impact-215": ["avis", "faq", "methode", "prestations", "produits", "tarifs"],
  "impact-216": ["avis", "chiffres", "faq", "prestations", "tarifs"],
  "impact-217": ["methode", "produits", "avis", "prestations"],
  "impact-218": ["avis", "prestations"],
  "impact-219": ["faq", "prestations", "realisations", "tarifs", "equipe"],
  "impact-220": ["avis", "methode", "realisations", "prestations"],
  "impact-221": ["avis", "realisations", "prestations"],
  "impact-222": ["avis", "chiffres", "prestations"],
  "impact-223": ["avis", "methode", "prestations", "realisations"],
  "impact-226": ["avis", "chiffres", "methode", "realisations", "tarifs"],
  "impact-227": ["avis", "chiffres", "equipe", "prestations", "tarifs"],
  "impact-228": ["avis", "chiffres", "engagements", "prestations"],
  "impact-229": ["avis", "chiffres", "prestations", "tarifs"],
  "impact-230": ["avis", "chiffres", "realisations", "engagements", "prestations"],
  "impact-231": ["avis", "chiffres", "methode", "prestations"],
  "impact-232": ["avis", "chiffres", "prestations", "engagements"],
  "impact-233": ["avis", "chiffres", "prestations"],
  "impact-235": ["realisations", "avis", "prestations"],
  "impact-236": ["avis", "prestations", "realisations"],
  "impact-237": ["avis", "prestations"],
  "impact-238": ["avis", "methode", "prestations"],
  "impact-239": ["avis", "realisations", "prestations"],
  "impact-240": ["methode", "prestations", "avis"],
  "impact-241": ["prestations", "avis"],
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
  "impact-262": ["avis", "prestations", "equipe"],
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
  "impact-274": ["avis", "equipe", "horaires", "prestations"],
  "impact-275": ["avis", "chiffres", "methode", "prestations"],
  "impact-276": ["avis", "chiffres", "methode", "prestations"],
  "impact-277": ["avis", "methode", "prestations", "realisations", "engagements"],
  "impact-278": ["avis", "methode", "prestations", "realisations"],
  "impact-279": ["avis", "prestations"],
  "impact-280": ["avis", "methode", "prestations", "realisations", "tarifs"],
  "impact-281": ["avis", "methode", "prestations"],
  "impact-282": ["avis", "menu", "methode", "tarifs"],
  "impact-283": ["avis", "equipe", "horaires", "prestations"],
  "impact-284": ["avis", "equipe", "prestations"],
  "impact-285": ["avis", "equipe", "horaires", "prestations"],
  "impact-286": ["avis", "chiffres", "methode", "prestations"],
  "impact-287": ["avis", "methode", "prestations", "tarifs"],
  "impact-288": ["avis", "engagements", "methode", "prestations"],
  "impact-289": ["avis", "chiffres", "methode", "prestations"],
  "impact-290": ["avis", "engagements", "methode", "prestations"],
  "impact-291": ["avis", "prestations"],
  "impact-292": ["avis", "faq", "horaires", "menu"],
  "impact-293": ["avis", "faq", "horaires", "menu"],
  "impact-294": ["avis", "faq", "horaires", "menu"],
  "impact-295": ["avis", "faq", "horaires", "menu"],
  "impact-296": ["avis", "faq", "horaires", "menu"],
  "impact-297": ["faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-298": ["faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-299": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-300": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-301": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-302": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-303": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-304": ["avis", "faq", "horaires", "menu", "prestations", "tarifs"],
  "impact-305": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-306": ["avis", "faq", "horaires", "menu"],
  "impact-307": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-308": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-309": ["avis", "faq", "horaires", "menu", "tarifs"],
  "impact-310": ["avis", "faq", "horaires", "menu", "prestations", "realisations", "tarifs"],
  "impact-311": ["avis", "faq", "horaires", "prestations"],
  "impact-312": ["avis", "chiffres", "faq", "horaires", "prestations"],
  "impact-313": ["avis", "faq", "prestations", "realisations"],
  "impact-314": ["avis", "faq", "prestations", "realisations"],
  "impact-315": ["avis", "engagements", "faq", "horaires", "prestations", "tarifs"],
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
  "impact-334": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-335": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-336": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-337": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-338": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-339": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-340": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-341": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-342": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-343": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-344": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-345": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-346": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-347": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-348": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-349": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-350": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-351": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-352": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-353": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-354": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-355": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-356": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-357": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-358": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-359": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-360": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-361": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-362": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-363": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-364": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-365": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
  "impact-366": ["avis", "chiffres", "methode", "prestations", "tarifs", "engagements"],
  "impact-367": ["avis", "chiffres", "engagements", "methode", "prestations", "tarifs"],
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
