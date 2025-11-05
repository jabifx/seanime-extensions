function init() {
    $ui.register((ctx) => {

        function getLang() {
            if (!$storage.has("language")) {
                $storage.set("language", "en");
                return "en";
            } else return $storage.get("language");
        }

        const lang = getLang();

        const TRANSLATION_CSV = `
key;es;fr;it;de;pt;ja;ko;zh-CN;zh-TW
My library;Biblioteca;Ma bibliothèque;La mia libreria;Meine Bibliothek;Minha biblioteca;マイライブラリ;내 라이브러리;我的资料库;我的資料庫
Schedule;Calendario;Calendrier;Programma;Zeitplan;Agenda;スケジュール;일정;日程;行程表
Manga;Manga;Manga;Manga;Manga;Mangá;マンガ;만화;漫画;漫畫
Discover;Descubrir;Découvrir;Scopri;Entdecken;Descobrir;発見;탐색;发现;探索
Extensions;Extensiones;Extensions;Estensioni;Erweiterungen;Extensões;拡張機能;확장 기능;扩展;擴充功能
Settings;Configuración;Paramètres;Impostazioni;Einstellungen;Configurações;設定;설정;设置;設定
Manage your plugins and content providers.;Administra tus plugins y proveedores.;Gérez vos plugins et fournisseurs de contenu.;Gestisci i tuoi plugin e fornitori di contenuti.;Verwalte deine Plugins und Inhaltsanbieter.;Gerencie seus plugins e provedores de conteúdo.;プラグインとコンテンツプロバイダーを管理します。;플러그인과 콘텐츠 제공자를 관리합니다.;管理你的插件和内容提供商。;管理你的外掛程式和內容提供者。
Check for updates;Buscar actualizaciones;Vérifier les mises à jour;Controlla gli aggiornamenti;Nach Updates suchen;Verificar atualizações;アップデートを確認;업데이트 확인;检查更新;檢查更新
Add an extension/plugin;Añadir una extensión/plugin;Ajouter une extension/plugin;Aggiungi un’estensione/plugin;Erweiterung/Plugin hinzufügen;Adicionar uma extensão/plugin;拡張機能/プラグインを追加;확장 기능/플러그인 추가;添加扩展/插件;新增擴充功能／外掛程式
Playground;Playground;Bac à sable;Area di test;Spielwiese;Área de testes;プレイグラウンド;플레이그라운드;测试区;遊樂場
Marketplace;Marketplace;Marché;Marketplace;Marktplatz;Mercado;マーケットプレイス;마켓플레이스;市场;市集
Built-in;Integrado;Intégré;Integrato;Eingebaut;Integrado;内蔵;내장됨;内置;內建
Browse and install extensions from the repository.;Explora e instala extensiones desde el repositorio.;Parcourez et installez des extensions depuis le dépôt.;Sfoglia e installa estensioni dal repository.;Durchsuche und installiere Erweiterungen aus dem Repository.;Explore e instale extensões do repositório.;リポジトリから拡張機能をブラウズしてインストールします。;저장소에서 확장 기능을 찾아 설치합니다.;从存储库浏览并安装扩展。;從儲存庫瀏覽並安裝擴充功能。
Source:;Fuente:;Source :;Fonte:;Quelle:;Fonte:;ソース：;소스:;来源：;來源：
Official repository;Repositorio oficial;Dépôt officiel;Repository ufficiale;Offizielles Repository;Repositório oficial;公式リポジトリ;공식 저장소;官方存储库;官方儲存庫
All types;Todos los tipos;Tous les types;Tutti i tipi;Alle Typen;Todos os tipos;すべてのタイプ;모든 유형;所有类型;所有類型
All Languages;Todos los idiomas;Toutes les langues;Tutte le lingue;Alle Sprachen;Todos os idiomas;すべての言語;모든 언어;所有语言;所有語言
Refresh;Actualizar;Rafraîchir;Aggiorna;Aktualisieren;Atualizar;更新;새로고침;刷新;重新整理
Refresh AniList;Actualizar AniList;Rafraîchir AniList;Aggiorna AniList;AniList aktualisieren;Atualizar AniList;AniListを更新;AniList 새로고침;刷新 AniList;重新整理 AniList
Search extensions...;Buscar extensiones...;Rechercher des extensions...;Cerca estensioni...;Erweiterungen suchen...;Procurar extensões...;拡張機能を検索...;확장 기능 검색...;搜索扩展...;搜尋擴充功能…
Apply Default;Aplicar por defecto;Appliquer par défaut;Applica predefinito;Standard anwenden;Aplicar padrão;デフォルトを適用;기본값 적용;应用默认;套用預設值
Cancel;Cancelar;Annuler;Annulla;Abbrechen;Cancelar;キャンセル;취소;取消;取消
Save;Guardar;Enregistrer;Salva;Speichern;Salvar;保存;저장;保存;儲存
Enter the URL of the repository JSON file.;Introduce la URL del archivo JSON del repositorio.;Entrez l’URL du fichier JSON du dépôt.;Inserisci l’URL del file JSON del repository.;Gib die URL der Repository-JSON-Datei ein.;Insira a URL do arquivo JSON do repositório.;リポジトリのJSONファイルのURLを入力してください。;저장소의 JSON 파일 URL을 입력하세요.;输入存储库 JSON 文件的 URL。;輸入儲存庫 JSON 檔案的網址。
Code;Código;Code;Codice;Code;Código;コード;코드;代码;程式碼
You can edit the code of the extension here.;Puedes editar el código de la extensión aquí.;Vous pouvez modifier le code de l’extension ici.;Puoi modificare il codice dell’estensione qui.;Hier kannst du den Code der Erweiterung bearbeiten.;Você pode editar o código da extensão aqui.;ここで拡張機能のコードを編集できます。;여기서 확장 코드 수정 가능;您可以在此编辑扩展代码。;你可以在此編輯擴充功能的程式碼。
Info;Info;Infos;Info;Info;Info;情報;정보;信息;資訊
Preferences;Preferencias;Préférences;Preferenze;Einstellungen;Preferências;設定;환경설정;偏好设置;偏好設定
You can edit the preferences for this extension here.;Puedes editar las preferencias de esta extensión aquí.;Vous pouvez modifier les préférences de cette extension ici.;Puoi modificare le preferenze di questa estensione qui.;Hier kannst du die Einstellungen dieser Erweiterung bearbeiten.;Você pode editar as preferências desta extensão aqui.;ここで拡張機能の設定を編集できます。;여기서 확장 환경설정을 수정할 수 있습니다.;您可以在此编辑此扩展的首选项。;你可以在此編輯此擴充功能的偏好設定。
Default:;Por defecto:;Par défaut :;Predefinito:;Standard:;Padrão:;デフォルト:;기본값:;默认：;預設值：
Author:;Autor:;Auteur :;Autore:;Autor:;Autor:;作者:;작성자:;作者：;作者：
Language:;Idioma:;Langue :;Lingua:;Sprache:;Idioma:;言語:;언어:;语言：;語言：
Programming language:;Lenguaje de programación:;Langage de programmation :;Linguaggio di programmazione:;Programmiersprache:;Linguagem de programação:;プログラミング言語:;프로그래밍 언어:;编程语言：;程式語言：
Check for updates;Buscar actualizaciones;Vérifier les mises à jour;Controlla gli aggiornamenti;Nach Updates suchen;Verificar atualizações;アップデートを確認;업데이트 확인;检查更新;檢查更新
Uninstall;Desinstalar;Désinstaller;Disinstalla;Deinstallieren;Desinstalar;アンインストール;제거;卸载;解除安裝
Grant;Conceder;Accorder;Concedi;Gewähren;Conceder;許可;허용;授予;授權
Permissions required;Permisos requeridos;Autorisations requises;Autorizzazioni richieste;Erforderliche Berechtigungen;Permissões necessárias;必要な権限;필요한 권한;所需权限;需要權限
Grant permissions;Conceder permisos;Accorder les autorisations;Concedi autorizzazioni;Berechtigungen erteilen;Conceder permissões;権限を許可;권한 부여;授予权限;授予權限
Storage: Store plugin data locally;Almacenamiento: guardar datos del plugin localmente;Stockage : enregistrer les données du plugin localement;Archiviazione: salva i dati del plugin localmente;Speicher: Plugin-Daten lokal speichern;Armazenamento: salvar dados do plugin localmente;ストレージ: プラグインデータをローカルに保存;저장소: 플러그인 데이터를 로컬에 저장;存储：本地保存插件数据;儲存空間：在本機儲存外掛資料
AniList: View and edit your AniList lists;AniList: ver y editar tus listas de AniList;AniList : voir et modifier vos listes AniList;AniList: visualizza e modifica le tue liste AniList;AniList: Zeige und bearbeite deine AniList-Listen;AniList: ver e editar suas listas AniList;AniList：リストの表示と編集;AniList: 목록 보기 및 편집;AniList：查看和编辑你的列表;AniList：檢視與編輯你的 AniList 清單
Database: Read and write non-auth data;Base de datos: leer y escribir datos no autenticados;Base de données : lire et écrire des données non authentifiées;Database: leggere e scrivere dati non autenticati;Datenbank: Nicht-authentifizierte Daten lesen und schreiben;Banco de dados: ler e gravar dados não autenticados;データベース：認証されていないデータの読み書き;데이터베이스: 인증되지 않은 데이터 읽기/쓰기;数据库：读取和写入非验证数据;資料庫：讀寫非驗證資料
AniList Token: View and use your AniList token;AniList Token: ver y usar tu token de AniList;AniList Token : voir et utiliser votre jeton AniList;Token AniList: visualizza e usa il tuo token AniList;AniList-Token: Token anzeigen und verwenden;Token AniList: ver e usar seu token;AniListトークン：表示と使用;AniList 토큰: 보기 및 사용;AniList 令牌：查看和使用;AniList 權杖：檢視並使用你的 AniList 權杖
The plugin;El plugin;Le plugin;Il plugin;Das Plugin;O plugin;プラグイン;플러그인;插件;此外掛
is requesting the following permissions:;solicita los siguientes permisos:;demande les autorisations suivantes :;richiede le seguenti autorizzazioni:;fordert die folgenden Berechtigungen an:;solicita as seguintes permissões:;次の権限を要求しています：;다음 권한을 요청 중입니다:;正在请求以下权限：;正在請求以下權限：
Remove;Eliminar;Supprimer;Rimuovi;Entfernen;Remover;削除;제거;删除;移除
This action cannot be undone.;Esta acción no se puede deshacer.;Cette action est irréversible.;Questa azione non può essere annullata.;Diese Aktion kann nicht rückgängig gemacht werden.;Esta ação não pode ser desfeita.;この操作は元に戻せません。;이 작업은 되돌릴 수 없습니다.;此操作无法撤销。;此動作無法復原。
Confirm;Confirmar;Confirmer;Conferma;Bestätigen;Confirmar;確認;확인;确认;確認
Library;Biblioteca;Bibliothèque;Libreria;Bibliothek;Biblioteca;ライブラリ;라이브러리;资料库;資料庫
Discover;Descubrir;Découvrir;Scopri;Entdecken;Descobrir;発見;탐색;发现;探索
Scan summaries;Resumenes de escaneo;Résumés de scan;Riepiloghi scansione;Scan-Zusammenfassungen;Resumos de varredura;スキャン概要;스캔 요약;扫描摘要;掃描摘要
Search;Buscar;Rechercher;Cerca;Suchen;Buscar;検索;검색;搜索;搜尋
View the media you've saved locally for offline use.;Ver el contenido que guardaste localmente para usar sin conexión.;Voir les médias enregistrés localement pour une utilisation hors ligne.;Visualizza i media salvati localmente per l’uso offline.;Zeige Medien, die du lokal für Offline-Nutzung gespeichert hast.;Ver os conteúdos salvos localmente para uso offline.;オフライン用にローカル保存したメディアを表示します。;오프라인용으로 로컬에 저장한 미디어 보기;查看你为离线使用而保存的本地媒体。;檢視你為離線使用而本機儲存的媒體。
Sync now;Sincronizar ahora;Synchroniser maintenant;Sincronizza ora;Jetzt synchronisieren;Sincronizar agora;今すぐ同期;지금 동기화;立即同步;立即同步
Save media;Guardar contenido;Enregistrer le média;Salva contenuti;Medien speichern;Salvar mídia;メディアを保存;미디어 저장;保存媒体;儲存媒體
Local storage size:;Tamaño de almacenamiento local:;Taille du stockage local :;Dimensione archivio locale:;Lokaler Speicherplatz:;Tamanho do armazenamento local:;ローカルストレージのサイズ：;로컬 저장소 크기:;本地存储大小：;本機儲存大小：
Update your local snapshots with the data from AniList. This will overwrite your offline changes. You can automate this in Configuración > Seanime > Offline.;Actualiza tus instantáneas locales con los datos de AniList. Esto sobrescribirá tus cambios sin conexión. Puedes automatizarlo en Configuración > Seanime > Offline.;Mettez à jour vos instantanés locaux avec les données d’AniList. Cela écrasera vos modifications hors ligne. Vous pouvez automatiser cela dans Paramètres > Seanime > Hors ligne.;Aggiorna i tuoi snapshot locali con i dati di AniList. Questo sovrascriverà le modifiche offline. Puoi automatizzarlo in Impostazioni > Seanime > Offline.;Aktualisiere deine lokalen Snapshots mit den AniList-Daten. Dies überschreibt deine Offline-Änderungen. Du kannst es automatisieren unter Einstellungen > Seanime > Offline.;Atualize seus snapshots locais com os dados do AniList. Isso vai sobrescrever suas mudanças offline. Pode ser automatizado em Configurações > Seanime > Offline.;AniListのデータでローカルスナップショットを更新します。オフラインの変更は上書きされます。設定 > Seanime > オフライン で自動化できます。;AniList 데이터로 로컬 스냅샷을 업데이트합니다. 오프라인 변경 사항이 덮어씁니다. 설정 > Seanime > 오프라인에서 자동화할 수 있습니다.;使用 AniList 数据更新本地快照。这将覆盖你的离线更改。可在 设置 > Seanime > 离线 中自动化。;使用 AniList 的資料更新你的本機快照。這將覆寫你的離線變更。你可以在「設定 > Seanime > 離線」中自動化此操作。
Update local data;Actualizar datos locales;Mettre à jour les données locales;Aggiorna dati locali;Lokale Daten aktualisieren;Atualizar dados locais;ローカルデータを更新;로컬 데이터 업데이트;更新本地数据;更新本機資料
Update your AniList lists with the data from your local snapshots. This should be done after you've made changes offline.;Actualiza tus listas de AniList con los datos de tus instantáneas locales. Hazlo después de realizar cambios sin conexión.;Mettez à jour vos listes AniList avec les données de vos instantanés locaux. À faire après avoir modifié hors ligne.;Aggiorna le tue liste AniList con i dati dei tuoi snapshot locali. Fallo dopo le modifiche offline.;Aktualisiere deine AniList-Listen mit den lokalen Snapshots. Führe das nach Offline-Änderungen durch.;Atualize suas listas AniList com os dados dos snapshots locais. Faça isso após alterações offline.;ローカルスナップショットのデータでAniListのリストを更新します。オフライン変更後に実行してください。;로컬 스냅샷 데이터를 사용해 AniList 목록을 업데이트하세요. 오프라인 수정 후 실행하세요.;使用本地快照数据更新你的 AniList 列表。请在离线修改后执行。;使用本機快照的資料更新你的 AniList 清單。此操作應在你離線變更後執行。
Changes are irreversible.;Los cambios no se pueden deshacer.;Les changements sont irréversibles.;Le modifiche non possono essere annullate.;Änderungen sind unwiderruflich.;As mudanças são irreversíveis.;変更は元に戻せません。;변경 사항은 되돌릴 수 없습니다.;更改无法撤销。;變更無法復原。
Upload local changes to AniList;Subir cambios locales a AniList;Téléverser les modifications locales sur AniList;Carica le modifiche locali su AniList;Lokale Änderungen zu AniList hochladen;Enviar alterações locais para AniList;ローカルの変更をAniListにアップロード;로컬 변경 사항을 AniList에 업로드;上传本地更改到 AniList;上傳本機變更至 AniList
Select the media you want to save locally. Click on already saved media to remove it from local storage.;Selecciona el contenido que quieras guardar localmente. Haz clic en uno ya guardado para eliminarlo.;Sélectionnez les médias à enregistrer localement. Cliquez sur ceux déjà enregistrés pour les supprimer.;Seleziona i contenuti da salvare localmente. Clicca su quelli già salvati per rimuoverli.;Wähle Medien zum lokalen Speichern. Klicke auf gespeicherte, um sie zu entfernen.;Selecione os conteúdos para salvar localmente. Clique nos já salvos para removê-los.;ローカルに保存したいメディアを選択します。すでに保存されているものをクリックすると削除されます。;로컬에 저장할 미디어를 선택하세요. 이미 저장된 항목을 클릭하면 제거됩니다.;选择要本地保存的媒体。点击已保存的项目将其删除。;選取你想要本機儲存的媒體。點擊已儲存的媒體可將其從本機儲存中移除。
Save locally;Guardar localmente;Enregistrer localement;Salva localmente;Lokal speichern;Salvar localmente;ローカルに保存;로컬에 저장;本地保存;本機儲存
Current;En curso;En cours;In corso;Aktuell;Atuais;現在;현재;当前;正在觀看
Planning;Planeado;Prévu;Pianificato;Geplant;Planejado;計画中;계획 중;计划中;計畫中
Completed;Completado;Terminé;Completato;Abgeschlossen;Concluído;完了;완료;已完成;已完成
Your library is empty;Tu biblioteca está vacía;Votre bibliothèque est vide;La tua libreria è vuota;Deine Bibliothek ist leer;Sua biblioteca está vazia;ライブラリは空です;라이브러리가 비어 있습니다;你的资料库是空的;你的資料庫是空的
Set the path to your local library and scan it;Establece la ruta a tu biblioteca local y escanéala;Définissez le chemin vers votre bibliothèque locale et scannez-la;Imposta il percorso della tua libreria locale e scansionala;Lege den Pfad zu deiner lokalen Bibliothek fest und scanne sie;Defina o caminho da sua biblioteca local e escaneie-a;ローカルライブラリのパスを設定してスキャンします。;로컬 라이브러리 경로를 설정하고 스캔하세요.;设置本地资料库路径并扫描。;設定本機資料庫的路徑並進行掃描
Include online streaming in your library;Incluir streaming online en tu biblioteca;Inclure le streaming en ligne dans votre bibliothèque;Includi lo streaming online nella tua libreria;Online-Streaming in Bibliothek aufnehmen;Incluir streaming online na biblioteca;オンラインストリーミングをライブラリに含める;온라인 스트리밍을 라이브러리에 포함;在资料库中包含在线播放;在資料庫中包含線上串流
Trending this season;Tendencias de esta temporada;Tendances de la saison;Tendenze di questa stagione;Beliebt in dieser Saison;Tendências desta temporada;今シーズンのトレンド;이번 시즌 인기작;本季流行;本季熱門
Watch;Ver;Regarder;Guarda;Ansehen;Assistir;見る;보기;观看;觀看
Releasing;En emisión;En diffusion;In uscita;Läuft;Em lançamento;放送中;방영 중;连载中;正在播出
Fall;Otoño;Automne;Autunno;Herbst;Outono;秋;가을;秋季;秋季
Summer;Verano;Été;Estate;Sommer;Verão;夏;여름;夏季;夏季
Winter;Invierno;Hiver;Inverno;Winter;Inverno;冬;겨울;冬季;冬季
Spring;Primavera;Printemps;Primavera;Frühling;Primavera;春;봄;春季;春季
days;días;jours;giorni;Tage;dias;日間;일;天;天數
Add to list;Agregar a la lista;Ajouter à la liste;Aggiungi alla lista;Zur Liste hinzufügen;Adicionar à lista;リストに追加;목록에 추가;添加到列表;加入清單
Releasing now;En emisión ahora;En diffusion maintenant;In uscita ora;Läuft gerade;Transmitindo agora;現在放送中;현재 방영 중;正在连载;正在播出
Episode;Episodio;Épisode;Episodi;Episode;Episódio;エピソード;에피소드;剧集;集數
Episodes;Episodios;Épisodes;Episodi;Episoden;Episódios;エピソード;에피소드;剧集;劇集
released;lanzados;sorti;rilasciati;veröffentlicht;lançado;リリースされた;출시됨;发布All;已發佈
Todo;Tout;Tutti;Alle;Tudo;すべて;전체;全部;;待辦
Action;Acción;Action;Azione;Action;Ação;アクション;액션;动作;動作
Adventure;Aventura;Aventure;Avventura;Abenteuer;Aventura;アドベンチャー;모험;冒险;冒險
Comedy;Comedia;Comédie;Commedia;Komödie;Comédia;コメディ;코미디;喜剧;喜劇
Drama;Drama;Drame;Dramma;Drama;Drama;ドラマ;드라마;剧情;劇情
Fantasy;Fantasía;Fantastique;Fantasia;Fantasie;Fantasia;ファンタジー;판타지;奇幻;奇幻
Horror;Terror;Horreur;Horror;Horror;Terror;ホラー;공포;恐怖;恐怖
Music;Música;Musique;Musica;Musik;Música;音楽;음악;音乐;音樂
Mystery;Misterio;Mystère;Mistero;Mystery;Mistério;ミステリー;미스터리;悬疑;懸疑
Psychological;Psicológico;Psychologique;Psicologico;Psychologisch;Psicológico;サイコロジカル;심리;心理;心理
Romance;Romance;Romance;Romantico;Romantik;Romance;ロマンス;로맨스;爱情;戀愛
Sci-Fi;Ciencia ficción;Science-fiction;Fantascienza;Sci-Fi;Ficção científica;SF;SF;科幻;科幻
Slice of Life;Slice of Life;Tranche de vie;Slice of Life;Slice of Life;Slice of Life;日常;일상;日常;日常
Sports;Deportes;Sports;Sport;Sport;Esportes;スポーツ;스포츠;体育;運動
Supernatural;Sobrenatural;Surnaturel;Soprannaturale;Übernatürlich;Sobrenatural;スーパーナチュラル;초자연;超自然;超自然
Thriller;Thriller;Thriller;Thriller;Thriller;Thriller;スリラー;스릴러;惊悚;驚悚
Release schedule;Calendario de estrenos;Calendrier des sorties;Calendario delle uscite;Veröffentlichungsplan;Agenda de lançamentos;リリーススケジュール;출시 일정;发行时间表;發行時間表
Based on your anime list;Basado en tu lista de anime;Basé sur ta liste d’anime;Basato sulla tua lista anime;Basierend auf deiner Anime-Liste;Baseado na sua lista de animes;あなたのアニメリストに基づく;당신의 애니 목록 기반;基于你的动画列表;根據你的動畫清單
Week starts on;La semana empieza en;La semaine commence le;La settimana inizia di;Woche beginnt am;A semana começa em;週の開始日;한 주 시작일;一周开始于;每週開始於
Monday;Lunes;Lundi;Lunedì;Montag;Segunda;月曜日;월요일;星期一;星期一
Tuesday;Martes;Mardi;Martedì;Dienstag;Terça;火曜日;화요일;星期二;星期二
Wednesday;Miércoles;Mercredi;Mercoledì;Mittwoch;Quarta;水曜日;수요일;星期三;星期三
Thursday;Jueves;Jeudi;Giovedì;Donnerstag;Quinta;木曜日;목요일;星期四;星期四
Friday;Viernes;Vendredi;Venerdì;Freitag;Sexta;金曜日;금요일;星期五;星期五
Saturday;Sábado;Samedi;Sabato;Samstag;Sábado;土曜日;토요일;星期六;星期六
Sunday;Domingo;Dimanche;Domenica;Sonntag;Domingo;日曜日;일요일;星期日;星期日
Status;Estado;Statut;Stato;Status;Status;ステータス;상태;状态;狀態
Completed;Completado;Terminé;Completato;Abgeschlossen;Concluído;完了;완료;已完成;已完成
Paused;Pausado;En pause;In pausa;Pausiert;Pausado;一時停止;일시 중지;已暂停;已暫停
Planning;Planeado;Prévu;Pianificato;Geplant;Planejado;計画中;계획 중;计划中;計畫中
Dropped;Abandonado;Abandonné;Abbandonato;Abgebrochen;Abandonado;中止;하차;已弃坑;已棄番
Repeating;Repitiendo;En répétition;Ripetendo;Wiederholung;Repetindo;再視聴中;반복 중;重温中;重看中
released;lanzado;sorti;rilasciati;veröffentlicht;lançado;リリースされた;출시됨;发布;已發佈
Indicate watched episodes;Marcar episodios vistos;Indiquer les épisodes vus;Segna episodi visti;Gesehene Episoden markieren;Indicar episódios assistidos;視聴済みエピソードを表示;시청한 에피소드 표시;标记已观看集数;標示已觀看的集數
Disable image transitions;Desactivar transiciones de imagen;Désactiver les transitions d’image;Disattiva le transizioni d’immagine;Bildübergänge deaktivieren;Desativar transições de imagem;画像切り替えを無効化;이미지 전환 비활성화;禁用图像切换;停用圖片轉場效果
Coming up next;A continuación;À suivre;In arrivo;Als Nächstes;A seguir;次に;다음 예정;接下来;即將播出
Mon;Lun;Lun;Lun;Mo;Seg;月;월;周一;週一
Tue;Mar;Mar;Mar;Di;Ter;火;화;周二;週二
Wed;Mié;Mer;Mer;Mi;Qua;水;수;周三;週三
Thu;Jue;Jeu;Gio;Do;Qui;木;목;周四;週四
Fri;Vie;Ven;Ven;Fr;Sex;金;금;周五;週五
Sat;Sáb;Sam;Sab;Sa;Sáb;土;토;周六;週六
Sun;Dom;Dim;Dom;So;Dom;日;일;周日;週日
Continue reading;Seguir leyendo;Continuer la lecture;Continua a leggere;Weiterlesen;Continuar lendo;続きを読む;계속 읽기;继续阅读;繼續閱讀
Downloads;Descargas;Téléchargements;Download;Downloads;Downloads;ダウンロード;다운로드;下载;下載
Score;Puntuación;Note;Punteggio;Bewertung;Pontuação;スコア;점수;评分;評分
Progress;Progreso;Progression;Progresso;Fortschritt;Progresso;進行状況;진행 상황;进度;進度
Start date;Fecha de inicio;Date de début;Data di inizio;Startdatum;Data de início;開始日;시작일;开始日期;開始日期
Completion date;Fecha de finalización;Date de fin;Data di completamento;Enddatum;Data de conclusão;完了日;완료일;完成日期;完成日期
Total rereads;Relecturas totales;Total de relectures;Riletture totali;Gesamtwiederholungen;Total de releituras;再読合計;총 재독 수;重读总数;重讀總次數
Refresh resouces;Actualizar recursos;Actualiser les ressources;Aggiorna risorse;Ressourcen aktualisieren;Atualizar recursos;リソースを更新;리소스 새로고침;刷新资源;重新整理資源
Unread chapters only;Solo capítulos no leídos;Chapitres non lus uniquement;Solo capitoli non letti;Nur ungelesene Kapitel;Apenas capítulos não lidos;未読チャプターのみ;읽지 않은 챕터만;仅未读章节;僅顯示未讀章節
Preview;Vista previa;Aperçu;Anteprima;Vorschau;Prévia;プレビュー;미리보기;预览;預覽
Advanced Search;Búsqueda avanzada;Recherche avancée;Ricerca avanzata;Erweiterte Suche;Pesquisa avançada;詳細検索;고급 검색;高级搜索;進階搜尋
Aired Recently;Emitido recientemente;Diffusé récemment;Trasmesso di recente;Kürzlich ausgestrahlt;Transmitido recentemente;最近放送;최근 방영;最近播出;最近播出
Top of the Season;Lo mejor de la temporada;Meilleur de la saison;Il meglio della stagione;Top der Saison;Top da temporada;今季トップ;이번 시즌 최고;本季最佳;本季最佳
Best of Last Season;Lo mejor de la temporada pasada;Meilleur de la saison précédente;Il meglio della scorsa stagione;Beste der letzten Saison;Melhor da temporada passada;前シーズンのベスト;지난 시즌 최고;上一季最佳;上季最佳
You Might Have Missed;Quizás te lo perdiste;Vous l’avez peut-être manqué;Potresti essertelo perso;Könntest verpasst haben;Talvez tenha perdido;見逃したかも;놓쳤을 수도 있음;你可能错过了;你可能錯過的
Coming Soon;Próximamente;À venir;In arrivo;Demnächst;Em breve;近日公開;곧 출시;即将推出;即將上映
Trending Movies;Películas en tendencia;Films tendance;Film di tendenza;Beliebte Filme;Filmes em alta;話題の映画;인기 영화;热门电影;熱門電影
Highest rated shows;Series mejor valoradas;Séries les mieux notées;Serie più votate;Bestbewertete Serien;Séries mais bem avaliadas;最高評価の番組;평점 높은 작품;最高评分作品;最高評分節目
Title;Título;Titre;Titolo;Titel;Título;タイトル;제목;标题;標題
Trending;En tendencia;Tendance;Di tendenza;Im Trend;Em alta;トレンド;트렌드;趋势;趨勢
Release Date;Fecha de estreno;Date de sortie;Data di uscita;Veröffentlichungsdatum;Data de lançamento;公開日;출시일;发布日期;發行日期
Highest Score;Puntuación más alta;Note la plus élevée;Punteggio più alto;Höchste Bewertung;Maior pontuação;最高スコア;최고 점수;最高分数;最高分
Number of episodes;Número de episodios;Nombre d’épisodes;Numero di episodi;Anzahl der Episoden;Número de episódios;エピソード数;에피소드 수;集数;集數
All genres;Todos los géneros;Tous les genres;Tutti i generi;Alle Genres;Todos os gêneros;すべてのジャンル;모든 장르;所有类型;所有類型
All formats;Todos los formatos;Tous les formats;Tutti i formati;Alle Formate;Todos os formatos;すべての形式;모든 형식;所有格式;所有格式
Movie;Película;Film;Film;Film;Filme;映画;영화;电影;電影
Special;Especial;Spécial;Speciale;Special;Especial;スペシャル;스페셜;特别篇;特別篇
All seasons;Todas las temporadas;Toutes les saisons;Tutte le stagioni;Alle Staffeln;Todas as temporadas;全シーズン;모든 시즌;所有季度;所有季度
Timeless;Atemporal;Intemporel;Senza tempo;Zeitlos;Atemporal;タイムレス;타임리스;永恒;經典永恆
All statuses;Todos los estados;Tous les statuts;Tutti gli stati;Alle Status;Todos os status;すべてのステータス;모든 상태;所有状态;所有狀態
Finished;Finalizado;Terminé;Finito;Abgeschlossen;Finalizado;完結;완결;已完结;已完結
Releasing;En emisión;En cours;In corso;Läuft;Em lançamento;放送中;방영 중;连载中;正在播出
Upcoming;Próximamente;À venir;In arrivo;Bevorstehend;Por vir;近日公開;곧 출시;即将推出;即將播出
Hiatus;En pausa;En pause;In pausa;Inaktiv;Hiato;休止中;휴재;停更;暫停中
Cancelled;Cancelado;Annulé;Cancellato;Abgebrochen;Cancelado;キャンセル済み;취소됨;已取消;已取消
All scores;Todas las puntuaciones;Toutes les notes;Tutti i punteggi;Alle Bewertungen;Todas as pontuações;すべてのスコア;모든 점수;所有评分;所有評分
Adult;Adulto;Adulte;Adulto;Erwachsenen;Adulto;アダルト;성인;成人;成人
Stats;Estadísticas;Statistiques;Statistiche;Statistiken;Estatísticas;統計;통계;统计;統計
Total Anime;Total de anime;Total d’anime;Totale anime;Gesamtanzahl Anime;Total de animes;アニメ合計;애니메이션 총계;动画总数;動畫總數
Watch time;Tiempo de visualización;Temps de visionnage;Tempo di visione;Sehzeit;Tempo assistindo;視聴時間;시청 시간;观看时间;觀看時間
hours;horas;heures;ore;Stunden;horas;時間;시간;小时;小時
Average score;Puntuación media;Note moyenne;Punteggio medio;Durchschnittsbewertung;Pontuação média;平均スコア;평균 점수;平均分;平均分數
Anime watched this year;Anime vistos este año;Animes regardés cette année;Anime guardati quest’anno;Dieses Jahr gesehene Anime;Animes assistidos este ano;今年見たアニメ;올해 본 애니;今年观看的动画;今年觀看的動畫
Anime watched last year;Anime vistos el año pasado;Animes regardés l’an dernier;Anime guardati l’anno scorso;Letztes Jahr gesehene Anime;Animes assistidos no ano passado;昨年見たアニメ;작년에 본 애니;去年观看的动画;去年觀看的動畫
Average score this year;Puntuación media este año;Note moyenne cette année;Punteggio medio quest’anno;Durchschnitt dieses Jahr;Pontuação média este ano;今年の平均スコア;올해 평균 점수;今年平均分;今年的平均分數
Hours watched;Horas vistas;Heures regardées;Ore guardate;Gesehene Stunden;Horas assistidas;視聴した時間;시청한 시간;观看小时数;觀看時數
Formats;Formatos;Formats;Formati;Formate;Formatos;フォーマット;형식;格式;格式
Average score;Puntuación media;Note moyenne;Punteggio medio;Durchschnittsbewertung;Pontuação média;平均スコア;평균 점수;平均分;平均分數
Statuses;Estados;Statuts;Stati;Status;Status;ステータス;상태;状态;狀態
Count;Cantidad;Nombre;Conteggio;Anzahl;Contagem;数;개수;数量;數量
Favorite genres;Géneros favoritos;Genres favoris;Generi preferiti;Lieblingsgenres;Gêneros favoritos;お気に入りジャンル;좋아하는 장르;喜好类型;最喜愛的類型
Years;Años;Années;Anni;Jahre;Anos;年;년;年份;年份
Anime watched per release year;Anime vistos por año de estreno;Animes regardés par année de sortie;Anime visti per anno di uscita;Animes pro Erscheinungsjahr;Animes assistidos por ano de lançamento;リリース年ごとの視聴アニメ;출시 연도별 시청 애니;按上映年份观看的动画;每發行年份觀看的動畫
Total Manga;Total de manga;Total de mangas;Totale manga;Gesamtzahl Manga;Total de mangás;マンガ合計;만화 총계;漫画总数;漫畫總數
Total chapters;Capítulos totales;Total de chapitres;Capitoli totali;Gesamtkapitel;Capítulos totais;総章数;총 챕터;章节总数;章節總數
Manga read this year;Mangas leídos este año;Mangas lus cette année;Manga letti quest’anno;Dieses Jahr gelesene Manga;Mangás lidos este ano;今年読んだマンガ;올해 읽은 만화;今年阅读的漫画;今年閱讀的漫畫
Manga read last year;Mangas leídos el año pasado;Mangas lus l’an dernier;Manga letti l’anno scorso;Letztes Jahr gelesene Manga;Mangás lidos no ano passado;昨年読んだマンガ;작년에 읽은 만화;去年阅读的漫画;去年閱讀的漫畫
Chapters read;Capítulos leídos;Chapitres lus;Capitoli letti;Gelesene Kapitel;Capítulos lidos;読んだ章;읽은 챕터;已读章节;已讀章節
Manga read per release year;Mangas leídos por año de publicación;Mangas lus par année de sortie;Manga letti per anno di pubblicazione;Manga pro Veröffentlichungsjahr;Mangás lidos por ano de lançamento;出版年ごとの読書マンガ;출시 연도별 읽은 만화;按出版年份阅读的漫画;每發行年份閱讀的漫畫
All lists;Todas las listas;Toutes les listes;Tutte le liste;Alle Listen;Todas as listas;すべてのリスト;모든 목록;所有列表;所有清單
Scan summaries;Resúmenes de escaneo;Résumés de scan;Riepiloghi scansione;Scan-Zusammenfassungen;Resumos de verificação;スキャン概要;스캔 요약;扫描摘要;掃描摘要
View the logs and details of your latest scans;Ver los registros y detalles de tus últimos escaneos;Voir les journaux et les détails de vos derniers scans;Visualizza i log e i dettagli delle ultime scansioni;Protokolle und Details der letzten Scans anzeigen;Ver os registros e detalhes das últimas verificações;最新のスキャンのログと詳細を表示;최근 스캔의 로그 및 세부 정보 보기;查看最近扫描的日志和详细信息;查看你最近掃描的日誌與詳細資料
No scan summaries available;No hay resúmenes de escaneo disponibles;Aucun résumé de scan disponible;Nessun riepilogo scansione disponibile;Keine Scan-Zusammenfassungen verfügbar;Nenhum resumo de verificação disponível;スキャン概要はありません;스캔 요약 없음;暂无扫描摘要;沒有可用的掃描摘要
Serch...;Buscar...;Rechercher...;Cerca...;Suchen...;Pesquisar...;検索...;검색...;搜索...;搜尋…
Sign out;Cerrar sesión;Se déconnecter;Disconnetti;Abmelden;Sair;ログアウト;로그아웃;退出登录;登出
Not in your library;No está en tu biblioteca;Pas dans ta bibliothèque;Non nella tua libreria;Nicht in deiner Bibliothek;Não está na sua biblioteca;ライブラリにありません;라이브러리에 없음;不在你的资料库中;不在你的資料庫中
The following episodes are not in your library:;Los siguientes episodios no están en tu biblioteca:;Les épisodes suivants ne sont pas dans votre bibliothèque :;I seguenti episodi non sono nella tua libreria:;Folgende Episoden sind nicht in deiner Bibliothek:;Os seguintes episódios não estão na sua biblioteca:;次のエピソードはライブラリにありません：;다음 에피소드는 라이브러리에 없습니다:;以下集数不在你的资料库：;以下劇集不在你的資料庫中：
Recommendations;Recomendaciones;Recommandations;Raccomandazioni;Empfehlungen;Recomendações;おすすめ;추천;推荐;推薦
Relations;Relaciones;Relations;Relazioni;Beziehungen;Relações;関連;관련;关联;關聯
Characters;Personajes;Personnages;Personaggi;Charaktere;Personagens;キャラクター;캐릭터;角色;角色
And more...;Y más...;Et plus...;E altro...;Und mehr...;E mais...;などなど...;그리고 더...;以及更多...;以及更多…
MAIN;PRINCIPAL;PRINCIPAL;PRINCIPALE;HAUPT;PRINCIPAL;メイン;메인;主要;主要
SUPPORTING;SECUNDARIO;SECONDAIRE;DI SUPPORTO;NEBEN;DE APOIO;サポート;조연;配角;配角
No chapters found;No se encontraron capítulos;Aucun chapitre trouvé;Nessun capitolo trovato;Keine Kapitel gefunden;Nenhum capítulo encontrado;章が見つかりません;챕터를 찾을 수 없음;未找到章节;未找到章節
Try another source;Prueba otra fuente;Essaye une autre source;Prova un’altra fonte;Versuche eine andere Quelle;Tente outra fonte;別のソースを試す;다른 소스를 시도;尝试其他来源;嘗試其他來源
Source;Fuente;Source;Fonte;Quelle;Fonte;ソース;소스;来源;來源
Manual match;Coincidencia manual;Correspondance manuelle;Corrispondenza manuale;Manuelles Matching;Correspondência manual;手動一致;수동 일치;手动匹配;手動匹配
Reload sources;Recargar fuentes;Recharger les sources;Ricarica fonti;Quellen neu laden;Recarregar fontes;ソースを再読み込み;소스 다시 불러오기;重新加载来源;重新載入來源
Match this manga to a search result;Vincular este manga a un resultado de búsqueda;Associer ce manga à un résultat de recherche;Collega questo manga a un risultato di ricerca;Diesen Manga mit einem Suchergebnis abgleichen;Associar este mangá a um resultado de busca;このマンガを検索結果に一致させる;이 만화를 검색 결과에 연결;将此漫画匹配到搜索结果;將此漫畫與搜尋結果匹配
Enter a title...;Introduce un título...;Entrez un titre...;Inserisci un titolo...;Titel eingeben...;Digite um título...;タイトルを入力...;제목 입력...;输入标题...;輸入標題…
No manual match;Sin coincidencia manual;Aucune correspondance manuelle;Nessuna corrispondenza manuale;Kein manuelles Matching;Sem correspondência manual;手動一致なし;수동 일치 없음;无手动匹配;沒有手動匹配
Downloaded chapters;Capítulos descargados;Chapitres téléchargés;Capitoli scaricati;Heruntergeladene Kapitel;Capítulos baixados;ダウンロード済みチャプター;다운로드된 챕터;已下载章节;已下載章節
Queue;Cola;File d’attente;Coda;Warteschlange;Fila;キュー;대기열;队列;佇列
Nothing in the queue;Nada en la cola;Rien dans la file;Niente in coda;Nichts in der Warteschlange;Nada na fila;キューに何もありません;대기열이 비어 있습니다;队列为空;佇列中沒有項目
Downloaded;Descargado;Téléchargé;Scaricato;Heruntergeladen;Baixado;ダウンロード済み;다운로드됨;已下载;已下載
No chapters downloaded;No hay capítulos descargados;Aucun chapitre téléchargé;Nessun capitolo scaricato;Keine Kapitel heruntergeladen;Nenhum capítulo baixado;ダウンロードされた章はありません;다운로드된 챕터 없음;没有下载的章节;沒有已下載的章節
Save locally;Guardar localmente;Enregistrer localement;Salva localmente;Lokal speichern;Salvar localmente;ローカルに保存;로컬에 저장;本地保存;本機儲存
General app settings;Configuración general de la app;Paramètres généraux de l’application;Impostazioni generali dell’app;Allgemeine App-Einstellungen;Configurações gerais do app;アプリ全体設定;앱 일반 설정;应用常规设置;一般應用程式設定
Open Data directory;Abrir directorio de datos;Ouvrir le répertoire de données;Apri cartella dati;Datenverzeichnis öffnen;Abrir diretório de dados;データディレクトリを開く;데이터 디렉토리 열기;打开数据目录;開啟資料目錄
Record an issue;Reportar un problema;Signaler un problème;Segnala un problema;Ein Problem melden;Reportar um problema;問題を報告;문제 보고;报告问题;回報問題
Automatically update progress;Actualizar progreso automáticamente;Mettre à jour la progression automatiquement;Aggiorna automaticamente i progressi;Fortschritt automatisch aktualisieren;Atualizar progresso automaticamente;自動で進行状況を更新;자동으로 진행 상황 업데이트;自动更新进度;自動更新進度
If enabled, your progress will be automatically updated when you watch 80% of an episode.;Si está activado, tu progreso se actualizará automáticamente al ver el 80% de un episodio.;Si activé, votre progression sera mise à jour automatiquement après 80 %;;;若啟用，當你觀看劇集達 80% 時，進度將自動更新。
key;es;fr;it;de;pt;ja;ko;zh-CN;鍵值
Record an issue;Reportar un problema;Signaler un problème;Segnala un problema;Ein Problem melden;Reportar um problema;問題を報告;문제 보고;报告问题;回報問題
Only applies to desktop and integrated players.;Solo aplica a reproductores de escritorio e integrados.;S'applique uniquement aux lecteurs de bureau et intégrés.;Si applica solo ai lettori desktop e integrati.;Gilt nur für Desktop- und integrierte Player.;Aplica apenas a reprodutores de desktop e integrados.;デスクトップおよび統合プレーヤーのみ対応。;데스크톱 및 통합 플레이어에만 적용됩니다.;仅适用于桌面和集成播放器;僅適用於桌面版與整合播放器。
Disable anime card trailers;Desactivar avances de tarjetas de anime;Désactiver les bandes-annonces des cartes d'anime;Disattiva i trailer delle schede anime;Anime-Karten-Trailer deaktivieren;Desativar trailers de cartões de anime;アニメカードトレーラーを無効にする;애니메이션 카드 예고편 비활성화;禁用动漫卡片预告;停用動畫卡片預告片
Hide audience score;Ocultar puntuación del público;Masquer le score du public;Nascondi il punteggio del pubblico;Publikumspunktzahl ausblenden;Ocultar pontuação do público;観客スコアを非表示にする;관객 점수 숨기기;隐藏观众评分;隱藏觀眾評分
If enabled, the audience score will be hidden until you decide to view it.;Si está activado, la puntuación del público se ocultará hasta que decidas verla.;Si activé, le score du public sera masqué jusqu'à ce que vous décidiez de le voir.;Se abilitato, il punteggio del pubblico sarà nascosto fino a quando non decidi di visualizzarlo.;Wenn aktiviert, wird die Publikumspunktzahl ausgeblendet, bis Sie sie anzeigen.;Se ativado, a pontuação do público ficará oculta até você decidir vê-la.;有効にすると、観客スコアは表示するまで非表示になります。;활성화하면 관객 점수가 볼 때까지 숨겨집니다.;启用后，观众评分将被隐藏，直到你决定查看;若啟用，觀眾評分將會隱藏，直到你選擇查看為止。
Enable adult content;Activar contenido adulto;Activer le contenu adulte;Abilita contenuti per adulti;Erwachseneninhalt aktivieren;Ativar conteúdo adulto;アダルトコンテンツを有効にする;성인 콘텐츠 활성화;启用成人内容;啟用成人內容
If disabled, adult content will be hidden from search results and your library.;Si está desactivado, el contenido adulto se ocultará en resultados de búsqueda y en tu biblioteca.;Si désactivé, le contenu adulte sera masqué dans les résultats de recherche et votre bibliothèque.;Se disabilitato, i contenuti per adulti saranno nascosti nei risultati di ricerca e nella tua libreria.;Wenn deaktiviert, werden erwachsene Inhalte in Suchergebnissen und Bibliothek ausgeblendet.;Se desativado, o conteúdo adulto será oculto nos resultados de pesquisa e na sua biblioteca.;無効にすると、検索結果やライブラリからアダルトコンテンツが非表示になります。;비활성화하면 검색 결과와 라이브러리에서 성인 콘텐츠가 숨겨집니다.;禁用后，成人内容将在搜索结果和库中隐藏;若停用，成人內容將從搜尋結果與資料庫中隱藏。
Blur adult content;Difuminar contenido adulto;Flouter le contenu adulte;Sfoca contenuti per adulti;Erwachseneninhalt verwischen;Desfocar conteúdo adulto;アダルトコンテンツをぼかす;성인 콘텐츠 흐리기;模糊成人内容;模糊成人內容
If enabled, adult content will be blurred.;Si está activado, el contenido adulto se difuminará.;Si activé, le contenu adulte sera flouté.;Se abilitato, i contenuti per adulti saranno sfocati.;Wenn aktiviert, werden erwachsene Inhalte unscharf dargestellt.;Se ativado, o conteúdo adulto será desfocado.;有効にすると、アダルトコンテンツがぼかされます。;활성화하면 성인 콘텐츠가 흐려집니다.;启用后，成人内容将被模糊;若啟用，成人內容將會被模糊處理。
Local data is used when you're not using an AniList account.;Se usa la información local cuando no estás usando una cuenta AniList.;Les données locales sont utilisées lorsque vous n'utilisez pas de compte AniList.;I dati locali vengono utilizzati quando non usi un account AniList.;Lokale Daten werden verwendet, wenn du kein AniList-Konto nutzt.;Os dados locais são usados quando você não está usando uma conta AniList.;AniListアカウントを使用していない場合は、ローカルデータが使用されます。;AniList 계정을 사용하지 않을 때 로컬 데이터가 사용됩니다.;未使用AniList账户时，将使用本地数据;當未使用 AniList 帳戶時，將使用本機資料。
Auto backup lists from AniList;Respaldo automático de listas desde AniList;Sauvegarde automatique des listes depuis AniList;Backup automatico delle liste da AniList;Automatisches Backup von Listen von AniList;Backup automático de listas do AniList;AniListからのリストを自動バックアップ;AniList에서 목록 자동 백업;自动从AniList备份列表;自動從 AniList 備份清單
If enabled, your local lists will be periodically updated by using your AniList data.;Si está activado, tus listas locales se actualizarán periódicamente usando tus datos de AniList.;Si activé, vos listes locales seront mises à jour périodiquement en utilisant vos données AniList.;Se abilitato, le tue liste locali verranno aggiornate periodicamente utilizzando i dati AniList.;Wenn aktiviert, werden Ihre lokalen Listen regelmäßig mit Ihren AniList-Daten aktualisiert.;Se ativado, suas listas locais serão atualizadas periodicamente usando seus dados AniList.;有効にすると、ローカルリストはAniListデータを使って定期的に更新されます。;활성화하면 로컬 목록이 AniList 데이터를 사용하여 주기적으로 업데이트됩니다.;启用后，本地列表将使用AniList数据定期更新;若啟用，你的本機清單將定期以 AniList 資料更新。
Offline mode;Modo sin conexión;Mode hors ligne;Modalità offline;Offline-Modus;Modo offline;オフラインモード;오프라인 모드;离线模式;離線模式
Only available when authenticated with AniList.;Solo disponible si has iniciado sesión en AniList.;Disponible uniquement lorsque vous êtes connecté à AniList.;Disponibile solo se autenticato con AniList.;Nur verfügbar, wenn Sie bei AniList angemeldet sind.;Disponível apenas quando autenticado com AniList.;AniListで認証されている場合のみ利用可能。;AniList 인증 시에만 사용 가능.;仅在已通过AniList验证时可用;僅在已驗證 AniList 帳戶時可用。
Only if no offline changes have been made.;Solo si no se han hecho cambios offline.;Seulement si aucun changement hors ligne n'a été effectué.;Solo se non sono state effettuate modifiche offline.;Nur wenn keine Offline-Änderungen vorgenommen wurden.;Apenas se nenhuma alteração offline tiver sido feita.;オフラインで変更が行われていない場合のみ。;오프라인 변경 사항이 없을 경우에만.;仅在未进行离线更改时;僅當未進行離線更改時可用。
Update local metadata automatically;Actualizar metadatos locales automáticamente;Mettre à jour les métadonnées locales automatiquement;Aggiorna automaticamente i metadati locali;Lokale Metadaten automatisch aktualisieren;Atualizar metadados locais automaticamente;ローカルメタデータを自動更新;로컬 메타데이터 자동 업데이트;自动更新本地元数据;自動更新本機中繼資料
If disabled, you will need to manually refresh your local metadata by clicking 'Sync now' in the offline mode page.;Si está desactivado, tendrás que actualizar manualmente los metadatos locales haciendo clic en 'Sincronizar ahora' en la página de modo sin conexión.;Si désactivé, vous devrez actualiser manuellement vos métadonnées locales en cliquant sur 'Synchroniser maintenant' sur la page du mode hors ligne.;Se disabilitato, dovrai aggiornare manualmente i metadati locali cliccando su 'Sincronizza ora' nella pagina della modalità offline.;Wenn deaktiviert, müssen Sie Ihre lokalen Metadaten manuell aktualisieren, indem Sie auf der Offline-Modus-Seite auf „Jetzt synchronisieren“ klicken.;Se desativado, você precisará atualizar manualmente seus metadados locais clicando em 'Sincronizar agora' na página do modo offline.;無効にすると、オフラインモードページで「今すぐ同期」をクリックしてローカルメタデータを手動で更新する必要があります。;비활성화하면 오프라인 모드 페이지에서 '지금 동기화'를 클릭해 로컬 메타데이터를 수동으로 새로고침해야 합니다.;禁用后，你需要在离线模式页面点击“立即同步”手动刷新本地元数据;若停用，你需要在離線模式頁面中點擊「立即同步」以手動刷新本機中繼資料。
Save all currently watched/read media for offline use;Guardar todos los medios que estás viendo/leyendo para uso offline;Enregistrer tous les médias actuellement regardés/lus pour une utilisation hors ligne;Salva tutti i media attualmente guardati/letti per l'uso offline;Alle derzeit angesehenen/gelesenen Medien für die Offline-Nutzung speichern;Salvar todos os meios que estão sendo assistidos/lidos para uso offline;オフラインで使用するために、現在視聴/読んでいるメディアをすべて保存;현재 보고/읽고 있는 모든 미디어를 오프라인용으로 저장;保存所有当前观看/阅读的媒体以供离线使用;為離線使用儲存所有目前觀看／閱讀的媒體
If enabled, Seanime will automatically save all currently watched/read media for offline use.;Si está activado, Seanime guardará automáticamente todos los medios que estás viendo/leyendo para uso offline.;Si activé, Seanime enregistrera automatiquement tous les médias actuellement regardés/lus pour une utilisation hors ligne.;Se abilitato, Seanime salverà automaticamente tutti i media attualmente guardati/letti per l'uso offline.;Wenn aktiviert, speichert Seanime automatisch alle derzeit angesehenen/gelesenen Medien für die Offline-Nutzung.;Se ativado, o Seanime salvará automaticamente todos os meios que estão sendo assistidos/lidos para uso offline.;有効にすると、Seanimeは現在視聴/読んでいるメディアを自動的にオフライン保存します。;활성화하면 Seanime가 현재 보고/읽고 있는 모든 미디어를 자동으로 오프라인 저장합니다.;启用后，Seanime会自动保存所有当前观看/阅读的媒体以供离线使用;若啟用，Seanime 將自動儲存所有目前觀看或閱讀的媒體以供離線使用。
Do not check for updates;No buscar actualizaciones;Ne pas vérifier les mises à jour;Non controllare aggiornamenti;Nicht nach Updates suchen;Não verificar atualizações;更新を確認しない;업데이트 확인 안 함;不检查更新;不檢查更新
If enabled, Seanime will not check for new releases.;Si está activado, Seanime no buscará nuevas actualizaciones.;Si activé, Seanime ne vérifiera pas les nouvelles versions.;Se abilitato, Seanime non controllerà nuove release.;Wenn aktiviert, sucht Seanime nicht nach neuen Versionen.;Se ativado, Seanime não verificará novos lançamentos.;有効にすると、Seanimeは新しいリリースを確認しません。;활성화하면 Seanime가 새 릴리스를 확인하지 않습니다.;启用后，Seanime不会检查新版本;若啟用，Seanime 將不會檢查新版本。
Keyboard shortcuts;Atajos de teclado;Raccourcis clavier;Scorciatoie da tastiera;Tastenkombinationen;Atalhos de teclado;キーボードショートカット;키보드 단축키;键盘快捷键;鍵盤快捷鍵
Open command palette;Abrir paleta de comandos;Ouvrir la palette de commandes;Apri la palette dei comandi;Befehlspalette öffnen;Abrir paleta de comandos;コマンドパレットを開く;명령 팔레트 열기;打开命令面板;開啟指令面板
or;o;ou;o;oder;o;ou;o;または;或;또는;o;或;o
Open torrent client on startup;Abrir cliente torrent al iniciar;Ouvrir le client torrent au démarrage;Apri client torrent all'avvio;Torrent-Client beim Start öffnen;Abrir cliente torrent na inicialização;起動時にTorrentクライアントを開く;시작 시 토렌트 클라이언트 열기;启动时打开 torrent 客户端;啟動時開啟種子客戶端
Open localhost web URL on startup;Abrir URL local al iniciar;Ouvrir l'URL locale au démarrage;Apri URL locale all'avvio;Lokale Web-URL beim Start öffnen;Abrir URL local na inicialização;起動時にローカルホストURLを開く;시작 시 로컬호스트 웹 URL 열기;启动时打开本地主机 URL;啟動時開啟本地主機網址
Disable system notifications;Desactivar notificaciones del sistema;Désactiver les notifications système;Disattiva notifiche di sistema;Systembenachrichtigungen deaktivieren;Desativar notificações do sistema;システム通知を無効にする;시스템 알림 비활성화;禁用系统通知;停用系統通知
Disable Auto Downloader system notifications;Desactivar notificaciones del sistema Auto Downloader;Désactiver les notifications du système Auto Downloader;Disattiva le notifiche del sistema Auto Downloader;Auto Downloader-Systembenachrichtigungen deaktivieren;Desativar notificações do sistema Auto Downloader;Auto Downloaderのシステム通知を無効にする;Auto Downloader 시스템 알림 비활성화;禁用 Auto Downloader 系统通知;停用自動下載器系統通知
Disable Auto Scanner System notifications;Desactivar notificaciones del sistema Auto Scanner;Désactiver les notifications du système Auto Scanner;Disattiva le notifiche del sistema Auto Scanner;Auto Scanner-Systembenachrichtigungen deaktivieren;Desativar notificações do sistema Auto Scanner;Auto Scannerのシステム通知を無効にする;Auto Scanner 시스템 알림 비활성화;禁用 Auto Scanner 系统通知;停用自動掃描器系統通知
Manage your local anime library;Gestionar tu biblioteca local de anime;Gérer votre bibliothèque locale d'anime;Gestisci la tua libreria anime locale;Verwalte deine lokale Anime-Bibliothek;Gerenciar sua biblioteca local de anime;ローカルアニメライブラリを管理;로컬 애니메이션 라이브러리 관리;管理你的本地动漫库;管理你的本機動畫資料庫
Library directory;Directorio de la biblioteca;Répertoire de la bibliothèque;Directory della libreria;Bibliotheksverzeichnis;Diretório da biblioteca;ライブラリディレクトリ;라이브러리 디렉터리;库目录;資料庫目錄
Path of the directory where your media files ared located. (Keep the casing consistent);Ruta del directorio donde están tus archivos de medios. (Mantén la mayúscula/minúscula igual);Chemin du répertoire où se trouvent vos fichiers médias. (Gardez la casse cohérente);Percorso della directory in cui si trovano i file multimediali. (Mantieni la stessa maiuscola/minuscola);Pfad des Verzeichnisses, in dem Ihre Mediendateien gespeichert sind. (Groß-/Kleinschreibung beibehalten);Caminho do diretório onde seus arquivos de mídia estão localizados. (Mantenha a capitalização consistente);メディアファイルがあるディレクトリのパス。(大文字小文字をそのままに);미디어 파일이 위치한 디렉터리 경로. (대소문자를 그대로 유지);媒体文件所在目录的路径。（保持大小写一致）;媒體檔案所在目錄的路徑。（請保持大小寫一致）
Additional library directories;Directorios adicionales de la biblioteca;Répertoires de bibliothèque supplémentaires;Directory aggiuntivi della libreria;Zusätzliche Bibliotheksverzeichnisse;Diretórios de biblioteca adicionais;追加のライブラリディレクトリ;추가 라이브러리 디렉터리;附加库目录;附加資料庫目錄
Include additional directory paths if your library is spread across multiple locations.;Incluye rutas de directorios adicionales si tu biblioteca está repartida en varios lugares.;Incluez des chemins de répertoire supplémentaires si votre bibliothèque est répartie sur plusieurs emplacements.;Includi percorsi di directory aggiuntivi se la tua libreria è distribuita su più posizioni.;Fügen Sie zusätzliche Verzeichnispfade hinzu, wenn Ihre Bibliothek an mehreren Orten verteilt ist.;Inclua caminhos de diretório adicionais se sua biblioteca estiver espalhada por vários locais.;ライブラリが複数の場所に分散している場合、追加のディレクトリパスを含める。;라이브러리가 여러 위치에 분산되어 있는 경우 추가 디렉터리 경로 포함;如果你的库分布在多个位置，请包括额外的目录路径;若你的資料庫分散於多個位置，請加入額外目錄路徑。
Directory;Directorio;Répertoire;Directory;Verzeichnis;Diretório;ディレクトリ;디렉터리;目录;目錄
Select a directory;Seleccionar un directorio;Sélectionner un répertoire;Seleziona una directory;Wählen Sie ein Verzeichnis;Selecionar um diretório;ディレクトリを選択;디렉터리 선택;选择目录;選擇目錄
When adding batches, not all files are guaranteed to be picked up.;Al añadir lotes, no todos los archivos se garantizará que se incluyan.;Lors de l'ajout de lots, tous les fichiers ne sont pas garantis d'être pris.;Quando si aggiungono batch, non tutti i file saranno necessariamente selezionati.;Beim Hinzufügen von Batches ist nicht garantiert, dass alle Dateien aufgenommen werden.;Ao adicionar lotes, nem todos os arquivos são garantidos de serem incluídos.;バッチを追加する際、すべてのファイルが取得されるとは限りません。;배치를 추가할 때 모든 파일이 선택된다는 보장은 없습니다.;添加批次时，不保证所有文件都能被选中;新增批次時，無法保證所有檔案都會被識別。
You have unsaved changes;Tienes cambios sin guardar;Vous avez des modifications non enregistrées;Hai modifiche non salvate;Sie haben nicht gespeicherte Änderungen;Você tem alterações não salvas;保存されていない変更があります;저장되지 않은 변경 사항이 있습니다;你有未保存的更改;你有未儲存的變更
Reset;Restablecer;Réinitialiser;Reimposta;Zurücksetzen;Redefinir;リセット;재설정;重置;重設
Automatically refresh library;Actualizar la biblioteca automáticamente;Actualiser automatiquement la bibliothèque;Aggiorna automaticamente la libreria;Bibliothek automatisch aktualisieren;Atualizar biblioteca automaticamente;ライブラリを自動更新;라이브러리 자동 새로고침;自动刷新库;自動刷新資料庫
Refresh library on startup;Actualizar la biblioteca al iniciar;Actualiser la bibliothèque au démarrage;Aggiorna la libreria all'avvio;Bibliothek beim Start aktualisieren;Atualizar biblioteca ao iniciar;起動時にライブラリを更新;시작 시 라이브러리 새로고침;启动时刷新库;啟動時刷新資料庫
Advanced;Avanzado;Avancé;Avanzato;Erweitert;Avançado;詳細;고급;高级;進階
Matching algorithm;Algoritmo de coincidencia;Algorithme de correspondance;Algoritmo di corrispondenza;Abgleichsalgorithmus;Algoritmo de correspondência;マッチングアルゴリズム;매칭 알고리즘;匹配算法;匹配算法
Matching threshold;Umbral de coincidencia;Seuil de correspondance;Soglia di corrispondenza;Abgleichsschwelle;Limite de correspondência;マッチング閾値;매칭 임계값;匹配阈值;匹配門檻
Choose the algorithm used to match files to AniList entries.;Elige el algoritmo para emparejar archivos con entradas de AniList.;Choisissez l'algorithme utilisé pour faire correspondre les fichiers aux entrées AniList.;Scegli l'algoritmo usato per abbinare i file alle voci AniList.;Wählen Sie den Algorithmus, der zum Abgleichen von Dateien mit AniList-Einträgen verwendet wird.;Escolha o algoritmo usado para corresponder arquivos às entradas do AniList.;AniListエントリとファイルを照合するために使用するアルゴリズムを選択してください。;AniList 항목과 파일을 일치시키는 데 사용할 알고리즘을 선택하십시오.;选择用于将文件与 AniList 条目匹配的算法;選擇用於將檔案匹配到 AniList 條目的算法。
The minimum score required for a file to be matched to an AniList entry. Default is 0.5.;Puntuación mínima necesaria para que un archivo coincida con una entrada de AniList. Por defecto es 0,5.;Score minimum requis pour qu'un fichier corresponde à une entrée AniList. Par défaut 0,5.;Punteggio minimo richiesto per associare un file a una voce AniList. Predefinito 0,5.;Minimale Punktzahl, die erforderlich ist, damit eine Datei mit einem AniList-Eintrag übereinstimmt. Standard ist 0,5.;Pontuação mínima necessária para que um arquivo corresponda a uma entrada AniList. Padrão 0,5.;AniListエントリにファイルを一致させるための最小スコア。デフォルトは0.5。;AniList 항목과 파일을 일치시키는 최소 점수. 기본값 0.5.;文件与AniList条目匹配所需的最低评分。默认值为0.5;將檔案匹配至 AniList 條目所需的最低分數，預設為 0.5。
Local files;Archivos locales;Fichiers locaux;File locali;Lokale Dateien;Arquivos locais;ローカルファイル;로컬 파일;本地文件;本機檔案
Scanned local file data;Datos escaneados de archivos locales;Données de fichiers locaux scannées;Dati dei file locali scansionati;Gescanntes lokales Dateimaterial;Dados de arquivos locais escaneados;スキャンされたローカルファイルデータ;스캔된 로컬 파일 데이터;已扫描的本地文件数据;已掃描的本機檔案資料
Export local file data;Exportar datos de archivos locales;Exporter les données de fichiers locaux;Esporta dati dei file locali;Lokale Dateiendaten exportieren;Exportar dados de arquivos locais;ローカルファイルデータをエクスポート;로컬 파일 데이터 내보내기;导出本地文件数据;匯出本機檔案資料
Import local files;Importar archivos locales;Importer des fichiers locaux;Importa file locali;Lokale Dateien importieren;Importar arquivos locais;ローカルファイルをインポート;로컬 파일 가져오기;导入本地文件;匯入本機檔案
Donate;Donar;Faire un don;Dona;Spenden;Doar;寄付;기부;捐赠;捐助
Anime playback;Reproducción de anime;Lecture d'anime;Riproduzione anime;Anime-Wiedergabe;Reprodução de anime;アニメ再生;애니메이션 재생;动漫播放;動畫播放
Video playback;Reproducción de video;Lecture vidéo;Riproduzione video;Videowiedergabe;Reprodução de vídeo;ビデオ再生;비디오 재생;视频播放;影片播放
Choose how anime is played on this device;Elige cómo se reproduce el anime en este dispositivo;Choisissez comment l'anime est lu sur cet appareil;Scegli come riprodurre l'anime su questo dispositivo;Wählen Sie, wie Anime auf diesem Gerät abgespielt wird;Escolha como o anime é reproduzido neste dispositivo;このデバイスでアニメを再生する方法を選択;이 장치에서 애니메이션을 재생하는 방법 선택;选择此设备上动漫的播放方式;選擇動畫在此裝置上的播放方式
Device;Dispositivo;Appareil;Dispositivo;Gerät;Dispositivo;デバイス;장치;设备;裝置
Downloaded Media;Medios descargados;Médias téléchargés;Media scaricati;Heruntergeladene Medien;Mídia baixada;ダウンロード済みメディア;다운로드된 미디어;已下载媒体;已下載媒體
Choose how to play anime files stored on your device;Elige cómo reproducir archivos de anime guardados en tu dispositivo;Choisissez comment lire les fichiers anime stockés sur votre appareil;Scegli come riprodurre i file anime salvati sul tuo dispositivo;Wählen Sie, wie auf Ihrem Gerät gespeicherte Anime-Dateien abgespielt werden;Escolha como reproduzir arquivos de anime armazenados no seu dispositivo;デバイスに保存されているアニメファイルの再生方法を選択;장치에 저장된 애니메이션 파일 재생 방법 선택;选择如何播放存储在设备上的动漫文件;選擇播放儲存在你裝置上的動畫檔案方式
Desktop Media Player;Reproductor de escritorio;Lecteur multimédia de bureau;Lettore multimediale desktop;Desktop-Mediaplayer;Reprodutor de mídia de desktop;デスクトップメディアプレーヤー;데스크톱 미디어 플레이어;桌面媒体播放器;桌面媒體播放器
Opens files in your system player with automatic tracking;Abre archivos en tu reproductor del sistema con seguimiento automático;Ouvre les fichiers dans votre lecteur système avec suivi automatique;Apre i file nel lettore di sistema con tracciamento automatico;Öffnet Dateien im Systemplayer mit automatischer Verfolgung;Abre arquivos no reprodutor do sistema com rastreamento automático;システムプレイヤーでファイルを開き、自動トラッキング;시스템 플레이어에서 파일 열기 및 자동 추적;在系统播放器中打开文件并自动跟踪;使用系統播放器開啟檔案並自動追蹤進度
Transcoding / Direct Play;Transcode / Reproducción;Transcodage / Lecture directe;Transcodifica / Riproduzione diretta;Transkodierung / Direktwiedergabe;Transcodificação / Reprodução direta;トランスコード / 直接再生;트랜스코딩 / 직접 재생;转码 / 直接播放;轉碼／直接播放
Plays in browser with transcoding;Reproduce en el navegador con transcodificación;Lecture dans le navigateur avec transcodage;Riproduce nel browser con transcodifica;Spielt im Browser mit Transkodierung;Reproduz no navegador com transcodificação;ブラウザでトランスコード再生;브라우저에서 트랜스코딩으로 재생;在浏览器中通过转码播放;於瀏覽器中播放（含轉碼）
External Player Link;Enlace a reproductor externo;Lien vers lecteur externe;Collegamento a lettore esterno;Externer Player-Link;Link para player externo;外部プレイヤーリンク;외부 플레이어 링크;外部播放器链接;外部播放器連結
Send stream URL to another application;Enviar URL del stream a otra aplicación;Envoyer l'URL du flux à une autre application;Invia URL dello stream a un'altra applicazione;Stream-URL an eine andere Anwendung senden;Enviar URL do stream para outro aplicativo;ストリームURLを別のアプリケーションに送信;스트림 URL을 다른 애플리케이션으로 전송;将流 URL 发送到另一个应用;將串流網址傳送至其他應用程式
No external player custom scheme has been set;No se ha configurado un esquema personalizado para el reproductor externo;Aucun schéma personnalisé pour le lecteur externe n'a été défini;Nessuno schema personalizzato per il lettore esterno è impostato;Kein benutzerdefiniertes Schema für externen Player festgelegt;Nenhum esquema personalizado de player externo foi definido;外部プレイヤーカスタムスキームは設定されていません;외부 플레이어 사용자 지정 스킴이 설정되지 않음;未设置外部播放器自定义方案;尚未設定外部播放器自訂協議
Add;Añadir;Ajouter;Aggiungi;Hinzufügen;Adicionar;追加;추가;添加;新增
Choose how to play streamed content from torrents and debrid services;Elige cómo reproducir contenido en streaming desde torrents y servicios de debrid;Choisissez comment lire le contenu en streaming depuis les torrents et services de débridage;Scegli come riprodurre contenuti in streaming da torrent e servizi debrid;Wählen Sie, wie gestreamte Inhalte von Torrents und Debrid-Diensten abgespielt werden;Escolha como reproduzir conteúdo transmitido de torrents e serviços de debrid;トレントやデブリサービスからのストリーミングコンテンツの再生方法を選択;토렌트 및 디브리드 서비스에서 스트리밍 콘텐츠 재생 방법 선택;选择如何播放来自种子和去阻服务的流媒体内容;選擇如何播放來自種子與解鎖服務的串流內容
Settings are saved automatically;Los ajustes se guardan automáticamente;Les paramètres sont enregistrés automatiquement;Le impostazioni vengono salvate automaticamente;Einstellungen werden automatisch gespeichert;As configurações são salvas automaticamente;設定は自動的に保存されます;설정이 자동으로 저장됩니다;设置会自动保存;設定會自動儲存
Desktop Media Player;Reproductor de escritorio;Lecteur multimédia de bureau;Lettore multimediale desktop;Desktop-Mediaplayer;Reprodutor de mídia de desktop;デスクトップメディアプレーヤー;데스크톱 미디어 플레이어;桌面媒体播放器;桌面媒體播放器
Seanime has built-in support for MPV, VLC, IINA, and MPC-HC.;Seanime tiene soporte integrado para MPV, VLC, IINA y MPC-HC.;Seanime prend en charge nativement MPV, VLC, IINA et MPC-HC.;Seanime supporta nativamente MPV, VLC, IINA e MPC-HC.;Seanime unterstützt MPV, VLC, IINA und MPC-HC standardmäßig.;Seanime tem suporte integrado para MPV, VLC, IINA e MPC-HC.;SeanimeはMPV、VLC、IINA、MPC-HCを標準でサポートしています。;Seanime는 MPV, VLC, IINA, MPC-HC를 기본 지원합니다.;Seanime内置支持MPV、VLC、IINA和MPC-HC;Seanime 內建支援 MPV、VLC、IINA 和 MPC-HC。
Default player;Reproductor por defecto;Lecteur par défaut;Lettore predefinito;Standard-Player;Reprodutor padrão;デフォルトプレイヤー;기본 플레이어;默认播放器;預設播放器
Player that will be used to open files and track your progress automatically.;Reproductor que se usará para abrir archivos y seguir tu progreso automáticamente.;Lecteur utilisé pour ouvrir les fichiers et suivre automatiquement votre progression.;Lettore utilizzato per aprire i file e tracciare automaticamente i progressi.;Player, der zum Öffnen von Dateien und automatischen Fortschrittstracking verwendet wird.;Player que será usado para abrir arquivos e acompanhar seu progresso automaticamente.;ファイルを開き、進捗を自動で追跡するプレイヤー。;파일을 열고 진행 상황을 자동으로 추적하는 플레이어;用于打开文件并自动跟踪进度的播放器;用於開啟檔案並自動追蹤進度的播放器。
Playback;Reproducción;Lecture;Riproduzione;Wiedergabe;Reprodução;再生;재생;播放;播放
Automatically play next episode;Reproducir automáticamente el siguiente episodio;Lire automatiquement l'épisode suivant;Riproduci automaticamente il prossimo episodio;Nächste Episode automatisch abspielen;Reproduzir automaticamente o próximo episódio;次のエピソードを自動再生;자동으로 다음 에피소드 재생;自动播放下一集;自動播放下一集
If enabled, Seanime will play the next episode after a delay when the current episode is completed.;Si está activado, Seanime reproducirá el siguiente episodio tras un retraso al finalizar el actual.;Si activé, Seanime lira l'épisode suivant après un délai lorsque l'épisode actuel est terminé.;Se abilitato, Seanime riprodurrà il prossimo episodio dopo un ritardo quando quello attuale è terminato.;Wenn aktiviert, spielt Seanime die nächste Episode nach einer Verzögerung ab, wenn die aktuelle Episode abgeschlossen ist.;Se ativado, Seanime reproduzirá o próximo episódio após um atraso quando o episódio atual terminar.;有効にすると、現在のエピソードが終了した後、Seanimeは次のエピソードを遅延再生します。;활성화하면 현재 에피소드가 끝난 후 Seanime가 다음 에피소드를 자동 재생합니다.;启用后，当当前集完成时，Seanime会延迟播放下一集;若啟用，當目前劇集結束後，Seanime 將在短暫延遲後自動播放下一集。
Configuration;Configuración;Configuration;Configurazione;Konfiguration;Configuração;設定;설정;配置;設定
Host;Host;Hôte;Host;Host;Host;ホスト;호스트;主机;主機
Username;Usuario;Nom d'utilisateur;Nome utente;Benutzername;Nome de usuário;ユーザー名;사용자 이름;用户名;使用者名稱
Password;Contraseña;Mot de passe;Password;Passwort;Senha;パスワード;비밀번호;密码;密碼
Port;Puerto;Port;Porta;Port;Porta;ポート;포트;端口;埠號
Application path;Ruta de la aplicación;Chemin de l'application;Percorso dell'applicazione;Anwendungspfad;Caminho do aplicativo;アプリケーションのパス;애플리케이션 경로;应用路径;應用程式路徑
Socket;Socket;Socket;Socket;Socket;Socket;ソケット;소켓;Socket;通訊端
Options;Opciones;Options;Opzioni;Optionen;Opções;オプション;옵션;选项;選項
Leave empty to use the CLI.;Déjalo vacío para usar la CLI.;Laisser vide pour utiliser le CLI.;Lascia vuoto per usare la CLI.;Leer lassen, um die CLI zu verwenden.;Deixe vazio para usar o CLI.;空にするとCLIを使用;비워 두면 CLI 사용;留空以使用CLI;留空以使用命令列介面（CLI）。
Send streams to an external player on this device.;Enviar streams a un reproductor externo en este dispositivo.;Envoyer des flux vers un lecteur externe sur cet appareil.;Invia stream a un lettore esterno su questo dispositivo.;Streams an einen externen Player auf diesem Gerät senden.;Enviar streams para um player externo neste dispositivo.;このデバイス上の外部プレイヤーにストリームを送信;이 장치의 외부 플레이어로 스트림 전송;将流发送到此设备上的外部播放器;將串流傳送至此裝置上的外部播放器。
Only applies to this device.;Solo aplica a este dispositivo.;Ne s'applique qu'à cet appareil.;Si applica solo a questo dispositivo.;Gilt nur für dieses Gerät.;Aplica apenas a este dispositivo.;このデバイスにのみ適用されます;이 장치에만 적용됨;仅适用于此设备;僅適用於此裝置。
Custom scheme;Esquema personalizado;Schéma personnalisé;Schema personalizzato;Benutzerdefiniertes Schema;Esquema personalizado;カスタムスキーム;사용자 지정 스킴;自定义方案;自訂協議
Example: outplayer://{url};Ejemplo: outplayer://{url};Exemple : outplayer://{url};Esempio: outplayer://{url};Beispiel: outplayer://{url};Exemplo: outplayer://{url};例: outplayer://{url};예시: outplayer://{url};示例: outplayer://{url};範例：outplayer://{url}
Encode file path in URL (library only) If enabled, the file path will be base64 encoded in the URL to avoid issues with special characters.;Codificar ruta de archivo en URL (solo biblioteca). Si está activado, la ruta del archivo se codificará en base64 en la URL para evitar problemas con caracteres especiales.;Encoder le chemin du fichier dans l'URL (bibliothèque uniquement) Si activé, le chemin sera encodé en base64 dans l'URL pour éviter les problèmes de caractères spéciaux.;Codifica il percorso del file nell'URL (solo libreria). Se abilitato, il percorso verrà codificato in base64 nell'URL per evitare problemi con caratteri speciali.;Dateipfad in URL codieren (nur Bibliothek). Wenn aktiviert, wird der Pfad in Base64 kodiert, um Probleme mit Sonderzeichen zu vermeiden.;Codificar caminho do arquivo na URL (somente biblioteca). Se ativado, o caminho do arquivo será codificado em base64 na URL para evitar problemas com caracteres especiais.;URLにファイルパスをエンコード（ライブラリのみ）有効にすると、特殊文字の問題を避けるためにURLでファイルパスがbase64でエンコードされます。;URL에 파일 경로 인코딩(라이브러리만) 활성화하면 URL에서 파일 경로가 base64로 인코딩되어 특수 문자 문제를 방지합니다.;在URL中编码文件路径（仅限库）启用后，文件路径将在URL中以base64编码，以避免特殊字符问题;在 URL 中編碼檔案路徑（僅限資料庫）若啟用，檔案路徑將以 base64 編碼以避免特殊字元問題。
Manage transcoding and direct play settings;Gestionar configuración de transcodificación y reproducción directa;Gérer les paramètres de transcodage et de lecture directe;Gestisci le impostazioni di transcodifica e riproduzione diretta;Transcoding- und Direct-Play-Einstellungen verwalten;Gerenciar configurações de transcodificação e reprodução direta;トランスコードと直接再生の設定を管理;트랜스코딩 및 직접 재생 설정 관리;管理转码和直接播放设置;管理轉碼與直接播放設定
Enable;Activar;Activer;Abilita;Aktivieren;Ativar;有効にする;활성화;启用;啟用
Direct play;Reproducción directa;Lecture directe;Riproduzione diretta;Direktwiedergabe;Reprodução direta;直接再生;직접 재생;直接播放;直接播放
Prefer transcoding;Preferir transcodificación;Préférer le transcodage;Preferisci transcodifica;Transkodierung bevorzugen;Preferir transcodificação;トランスコードを優先;트랜스코딩 우선;优先转码;偏好轉碼
If enabled, Seanime will not automatically switch to direct play if the media codec is supported by the client.;Si está activado, Seanime no cambiará automáticamente a reproducción directa si el codec de medios es compatible con el cliente.;Si activé, Seanime ne passera pas automatiquement en lecture directe si le codec est pris en charge par le client.;Se abilitato, Seanime non passerà automaticamente alla riproduzione diretta se il codec multimediale è supportato dal client.;Wenn aktiviert, wechselt Seanime nicht automatisch zur Direktwiedergabe, wenn der Mediencodec vom Client unterstützt wird.;Se ativado, Seanime não mudará automaticamente para reprodução direta se o codec for suportado pelo cliente.;有効にすると、メディアコーデックがクライアントでサポートされている場合、Seanimeは自動で直接再生に切り替えません。;활성화하면 미디어 코덱이 클라이언트에서 지원되는 경우 Seanime가 자동으로 직접 재생으로 전환하지 않습니다.;启用后，如果客户端支持媒体编解码器，Seanime不会自动切换到直接播放;若啟用，即使客戶端支援媒體編碼，Seanime 也不會自動切換為直接播放。
Direct play only;Solo reproducción directa;Lecture directe uniquement;Solo riproduzione diretta;Nur Direktwiedergabe;Somente reprodução direta;直接再生のみ;직접 재생만;仅直接播放;僅允許直接播放
Only allow direct play. Transcoding will never be started.;Solo permitir reproducción directa. La transcodificación nunca se iniciará.;Autoriser uniquement la lecture directe. Le transcodage ne sera jamais lancé.;Consentire solo la riproduzione diretta. La transcodifica non verrà mai avviata.;Nur Direktwiedergabe zulassen. Transcodierung wird nie gestartet.;Permitir apenas reprodução direta. A transcodificação nunca será iniciada.;直接再生のみを許可。トランスコードは一切開始されません。;직접 재생만 허용. 트랜스코딩은 절대 시작되지 않습니다.;仅允许直接播放。转码将永远不会启动;僅允許直接播放，不會啟動轉碼。
Transcoding;Transcodificación;Transcodage;Transcodifica;Transkodierung;Transcodificação;トランスコード;트랜스코딩;转码;轉碼
Hardware acceleration;Aceleración por hardware;Accélération matérielle;Accelerazione hardware;Hardwarebeschleunigung;Aceleração de hardware;ハードウェアアクセラレーション;하드웨어 가속;硬件加速;硬體加速
Hardware acceleration is highly recommended for a smoother transcoding experience.;Se recomienda mucho la aceleración por hardware para una transcodificación más fluida.;L'accélération matérielle est fortement recommandée pour une expérience de transcodage plus fluide.;Si consiglia vivamente l'accelerazione hardware per un'esperienza di transcodifica più fluida.;Hardwarebeschleunigung wird dringend empfohlen für eine reibungslosere Transcodierung.;Aceleração de hardware é altamente recomendada para uma experiência de transcodificação mais suave.;スムーズなトランスコードのためにハードウェアアクセラレーションを強く推奨します。;원활한 트랜스코딩을 위해 하드웨어 가속을 적극 권장합니다.;强烈建议使用硬件加速以获得更流畅的转码体验;強烈建議啟用硬體加速以獲得更順暢的轉碼體驗。
Transcode preset;Fast' is recommended. VAAPI does not support presets.;Preajuste de transcodificación;Préréglage de transcodage;Preset di transcodifica;Transcodierungsvoreinstellung;Predefinição de transcodificação;トランスコードプリセット;트랜스코드 프리셋;轉碼預設
Fast' is recommended. VAAPI does not support presets.;Se recomienda 'Fast'. VAAPI no soporta presets.;Fast' est recommandé. VAAPI ne prend pas en charge les presets.;Fast' è consigliato. VAAPI non supporta i preset.;Fast' wird empfohlen. VAAPI unterstützt keine Presets.;Recomendado 'Fast'. VAAPI não suporta presets.;「Fast」推奨。VAAPIはプリセットをサポートしていません。;「Fast」권장. VAAPI는 프리셋을 지원하지 않습니다.;推荐“Fast”。VAAPI不支持预设;建議使用「Fast」。VAAPI 不支援預設設定。
Medium;Medio;Moyen;Medio;Mittel;Médio;中;중간;中;中等
Fast;Rápido;Rapide;Veloce;Schnell;Rápido;速い;빠름;快;快速
Veryfast;Muy rápido;Très rapide;Molto veloce;Sehr schnell;Muito rápido;非常に速い;매우 빠름;非常快;非常快
superfast;Súper rápido;Super rapide;Super veloce;Super schnell;Super rápido;超速;슈퍼 빠름;超快;超快
ultrafast;Ultra rápido;Ultra rapide;Ultra veloce;Ultraschnell;Ultra rápido;ウルトラ速い;울트라 빠름;极快;極快
Path to the FFmpeg binary. Leave empty if binary is already in your PATH.;Ruta del binario de FFmpeg. Déjalo vacío si ya está en tu PATH.;Chemin vers le binaire FFmpeg. Laisser vide si le binaire est déjà dans votre PATH.;Percorso del binario FFmpeg. Lascia vuoto se il binario è già nel tuo PATH.;Pfad zur FFmpeg-Binärdatei. Leer lassen, wenn die Binärdatei bereits in Ihrem PATH ist.;Caminho para o binário FFmpeg. Deixe vazio se o binário já estiver no PATH.;FFmpegバイナリへのパス。PATHに既にある場合は空のままに;FFmpeg 바이너리 경로. 이미 PATH에 있는 경우 비워 두세요.;FFmpeg 二进制路径。如果二进制文件已在PATH中，请留空;FFmpeg 可執行檔路徑。若已在系統 PATH 中，請留空。
Path to the FFprobe binary. Leave empty if binary is already in your PATH.;Ruta del binario de FFprobe. Déjalo vacío si ya está en tu PATH.;Chemin vers le binaire FFprobe. Laisser vide si le binaire est déjà dans votre PATH.;Percorso del binario FFprobe. Lascia vuoto se il binario è già nel tuo PATH.;Pfad zur FFprobe-Binärdatei. Leer lassen, wenn die Binärdatei bereits in Ihrem PATH ist.;Caminho para o binário FFprobe. Deixe vazio se o binário já estiver no PATH.;FFprobeバイナリへのパス。PATHに既にある場合は空のままに;FFprobe 바이너리 경로. 이미 PATH에 있는 경우 비워 두세요.;FFprobe 二进制路径。如果二进制文件已在PATH中，请留空;FFprobe 可執行檔路徑。若已在系統 PATH 中，請留空。
Configure the torrent provider;Configurar proveedor de torrents;Configurer le fournisseur de torrents;Configura il provider torrent;Torrent-Anbieter konfigurieren;Configurar provedor de torrents;トレントプロバイダを設定;토렌트 공급자 설정;配置种子提供者;設定種子提供者
Torrent Provider;Proveedor de torrents;Fournisseur de torrents;Provider torrent;Torrent-Anbieter;Provedor de torrents;トレントプロバイダ;토렌트 제공자;种子提供者;種子提供者
Used by the search engine and auto downloader. Select 'None' if you don't need torrent support.;由搜尋引擎與自動下載器使用。若不需要種子支援，請選擇「無」。
None;Ninguno;Aucun;Nessuno;Keine;Nenhum;なし;없음;无;無
Torrent Client;Cliente torrent;Client torrent;Client torrent;Torrent-Client;Cliente torrent;トレントクライアント;토렌트 클라이언트;种子客户端;種子客戶端
Configure the torrent client;Configurar cliente torrent;Configurer le client torrent;Configura il client torrent;Torrent-Client konfigurieren;Configurar cliente torrent;トレントクライアントを設定;토렌트 클라이언트 설정;配置种子客户端;設定種子客戶端
Default torrent client;Cliente torrent por defecto;Client torrent par défaut;Client torrent predefinito;Standard-Torrent-Client;Cliente torrent padrão;デフォルトのトレントクライアント;기본 토렌트 클라이언트;默认种子客户端;預設種子客戶端
User Interface;Interfaz de usuario;Interface utilisateur;Interfaccia utente;Benutzeroberfläche;Interface do usuário;ユーザーインターフェイス;사용자 인터페이스;用户界面;使用者介面
Hide torrent list navigation icon;Ocultar icono de navegación de la lista de torrents;Masquer l'icône de navigation de la liste de torrents;Nascondi icona di navigazione lista torrent;Torrentlisten-Navigationssymbol ausblenden;Ocultar ícone de navegação da lista de torrents;トレントリストナビゲーションアイコンを非表示;토렌트 목록 내비게이션 아이콘 숨기기;隐藏种子列表导航图标;隱藏種子清單導覽圖示
Show active torrent count;Mostrar número de torrents activos;Afficher le nombre de torrents actifs;Mostra il numero di torrent attivi;Anzahl aktiver Torrents anzeigen;Mostrar número de torrents ativos;アクティブなトレントの数を表示;활성 토렌트 수 표시;显示活动种子数量;顯示活躍種子數量
Show the number of active torrents in the sidebar. (Memory intensive);Mostrar la cantidad de torrents activos en la barra lateral. (Intensivo en memoria);Afficher le nombre de torrents actifs dans la barre latérale. (Consommation mémoire élevée);Mostra il numero di torrent attivi nella barra laterale. (Consumo di memoria elevato);Zeige die Anzahl aktiver Torrents in der Seitenleiste an. (Speicherintensiv);Mostrar o número de torrents ativos na barra lateral. (Intensivo em memória);サイドバーにアクティブなトレント数を表示（メモリ消費高）;사이드바에 활성 토렌트 수 표시 (메모리 많이 사용);在侧边栏显示活动种子数量。（占用内存高）;在側邊欄顯示活躍種子數量。（佔用記憶體）
Torrent Streaming;Streaming de torrents;Streaming de torrents;Streaming torrent;Torrent-Streaming;Streaming de torrents;トレントストリーミング;토렌트 스트리밍;种子流;種子串流
Configure torrent streaming settings;Configurar ajustes de streaming de torrents;Configurer les paramètres de streaming torrent;Configura le impostazioni di streaming torrent;Torrent-Streaming-Einstellungen konfigurieren;Configurar configurações de streaming de torrents;トレントストリーミング設定を構成;토렌트 스트리밍 설정 구성;配置种子流设置;設定種子串流設定
Include in library;Incluir en la biblioteca;Inclure dans la bibliothèque;Includi nella libreria;In Bibliothek aufnehmen;Incluir na biblioteca;ライブラリに含める;라이브러리에 포함;加入到库中;包含於資料庫
Add non-downloaded shows that are in your currently watching list to 'My library' for streaming;Agregar shows no descargados que están en tu lista de viendo actualmente a 'Mi biblioteca' para streaming;Ajouter les shows non téléchargés de votre liste de lecture actuelle à «Ma bibliothèque» pour le streaming;Aggiungi show non scaricati presenti nella lista "attualmente guardando" a "La mia libreria" per lo streaming;Nicht heruntergeladene Shows, die sich auf Ihrer aktuellen Watchlist befinden, zur Bibliothek hinzufügen;Adicionar shows não baixados que estão na sua lista de assistindo atualmente para "Minha biblioteca" para streaming;現在視聴リストにある未ダウンロードの番組を「マイライブラリ」に追加してストリーミング;현재 시청 중인 목록에 있는 다운로드되지 않은 쇼를 '내 라이브러리'에 추가하여 스트리밍;将当前观看列表中未下载的节目添加到“我的库”用于流媒体;將目前正在觀看但未下載的節目新增至「我的資料庫」以進行串流
Auto-select;Selección automática;Sélection automatique;Selezione automatica;Automatische Auswahl;Seleção automática;自動選択;자동 선택;自动选择;自動選擇
Let Seanime find the best torrent automatically.;Deja que Seanime encuentre automáticamente el mejor torrent.;Laissez Seanime trouver automatiquement le meilleur torrent.;Lascia che Seanime trovi automaticamente il torrent migliore.;Seanime den besten Torrent automatisch finden lassen.;Deixe Seanime encontrar automaticamente o melhor torrent.;Seanimeに自動で最適なトレントを探させる;Seanime가 자동으로 최고의 토렌트를 찾게 하기;让Seanime自动找到最佳种子;讓 Seanime 自動尋找最佳種子。
Preferred resolution;Resolución preferida;Résolution préférée;Risoluzione preferita;Bevorzugte Auflösung;Resolução preferida;希望解像度;선호 해상도;首选分辨率;偏好解析度
If auto-select is enabled, Seanime will try to find torrents with this resolution.;Si la selección automática está activada, Seanime intentará encontrar torrents con esta resolución.;Si la sélection automatique est activée, Seanime essaiera de trouver des torrents avec cette résolution.;Se la selezione automatica è abilitata, Seanime proverà a trovare torrent con questa risoluzione.;Wenn Auto-Auswahl aktiviert ist, versucht Seanime, Torrents mit dieser Auflösung zu finden.;Se a seleção automática estiver ativada, Seanime tentará encontrar torrents com esta resolução.;自動選択が有効な場合、Seanimeはこの解像度のトレントを探します;자동 선택이 활성화되면 Seanime가 이 해상도의 토렌트를 찾습니다;如果启用自动选择，Seanime将尝试找到此分辨率的种子;若啟用自動選擇，Seanime 將嘗試尋找符合此解析度的種子。
Highest;Más alto;Le plus élevé;Massimo;Höchste;Mais alto;最高;최고;最高;最高
Leave empty for default. The host to listen for new uTP and TCP BitTorrent connections.;Déjalo vacío para el valor por defecto. Host para escuchar nuevas conexiones uTP y TCP de BitTorrent.;Laissez vide pour la valeur par défaut. Hôte pour écouter les nouvelles connexions uTP et TCP BitTorrent.;Lascia vuoto per impostazione predefinita. Host per ascoltare nuove connessioni uTP e TCP BitTorrent.;Leer für Standard lassen. Host zum Abhören neuer uTP- und TCP-BitTorrent-Verbindungen.;Deixe vazio para padrão. Host para ouvir novas conexões uTP e TCP BitTorrent.;デフォルトの場合は空にします。新しいuTPおよびTCP BitTorrent接続を待ち受けるホスト;기본값으로 비워 두세요. 새로운 uTP 및 TCP BitTorrent 연결을 수신할 호스트;留空为默认。用于监听新的uTP和TCP BitTorrent连接的主机;留空以使用預設值。此為監聽新 uTP 與 TCP BitTorrent 連線的主機。
Leave empty for default. Default is 43213.;Déjalo vacío para el valor por defecto. Por defecto es 43213.;Laissez vide pour la valeur par défaut. Par défaut 43213.;Lascia vuoto per impostazione predefinita. Predefinito 43213.;Leer für Standard lassen. Standard ist 43213.;Deixe vazio para padrão. Padrão é 43213.;デフォルトの場合は空にします。デフォルトは43213です。;기본값으로 비워 두세요. 기본값은 43213입니다.;留空为默认。默认值为43213;留空以使用預設值，預設為 43213。
Disable IPv6;Desactivar IPv6;Désactiver IPv6;Disabilita IPv6;IPv6 deaktivieren;Desativar IPv6;IPv6を無効にする;IPv6 비활성화;禁用IPv6;停用 IPv6
Slow seeding;Sembrado lento;Seed lent;Seeding lento;Langsames Seeden;Seed lento;シードが遅い;시드 느림;上传慢;降低播種速度
This can help avoid issues with your network.;Esto puede ayudar a evitar problemas con tu red.;Cela peut aider à éviter les problèmes avec votre réseau.;Questo può aiutare a evitare problemi con la tua rete.;Dies kann helfen, Probleme mit Ihrem Netzwerk zu vermeiden.;Isso pode ajudar a evitar problemas com sua rede.;これによりネットワークの問題を回避できます;이것은 네트워크 문제를 피하는 데 도움이 될 수 있습니다;这可以帮助避免网络问题;這有助於避免網路問題。
Stream URL address;Dirección de la URL del stream;Adresse URL du stream;Indirizzo URL dello stream;Stream-URL-Adresse;Endereço da URL do stream;ストリームURLアドレス;스트림 URL 주소;流地址;串流 URL 位址
Modify the stream URL formatting. Leave empty for default.;Modificar el formato de la URL del stream. Déjalo vacío para usar el predeterminado.;Modifier le format de l'URL du stream. Laisser vide pour la valeur par défaut.;Modifica il formato dell'URL dello stream. Lascia vuoto per il valore predefinito.;Stream-URL-Format ändern. Leer lassen für Standard.;Modificar o formato da URL do stream. Deixe vazio para padrão.;ストリームURLのフォーマットを変更。デフォルトの場合は空のままに;스트림 URL 형식 수정. 기본값 사용 시 비워 두기;修改流URL格式。留空使用默认;修改串流 URL 格式。留空以使用預設值。
Where the torrents will be downloaded to while streaming. Leave empty to use the default cache directory.;Dónde se descargarán los torrents mientras se hace streaming. Déjalo vacío para usar la carpeta de caché predeterminada.;Où les torrents seront téléchargés pendant le streaming. Laisser vide pour utiliser le répertoire de cache par défaut.;Dove verranno scaricati i torrent durante lo streaming. Lascia vuoto per usare la cartella cache predefinita.;Wo Torrents während des Streamings heruntergeladen werden. Leer lassen für Standard-Cache-Verzeichnis.;Onde os torrents serão baixados durante o streaming. Deixe vazio para usar o diretório de cache padrão.;ストリーミング中にトレントがダウンロードされる場所。デフォルトキャッシュディレクトリを使用する場合は空のまま;스트리밍 중 토렌트가 다운로드될 위치. 기본 캐시 디렉터리 사용 시 비워 두기;流媒体播放时种子下载位置。留空使用默认缓存目录;設定串流期間下載種子的儲存位置。留空以使用預設快取目錄。
Debrid Service;Servicio de Debrid;Service de Debrid;Servizio Debrid;Debrid-Dienst;Serviço de Debrid;デブリドサービス;Debrid 서비스;Debrid服务;Debrid 服務
Configure your debrid service integration;Configura la integración de tu servicio de Debrid;Configurer l'intégration de votre service de Debrid;Configura l'integrazione del tuo servizio Debrid;Debrid-Service-Integration konfigurieren;Configurar a integração do seu serviço de Debrid;デブリドサービスの統合を設定;Debrid 서비스 통합 구성;配置Debrid服务集成;設定你的 Debrid 服務整合
Provider;Proveedor;Fournisseur;Provider;Anbieter;Provedor;プロバイダ;제공자;提供者;提供者
Debrid Streaming;Streaming de Debrid;Streaming Debrid;Streaming Debrid;Debrid-Streaming;Streaming Debrid;デブリドストリーミング;Debrid 스트리밍;Debrid流;Debrid 串流
Other features;Otras funciones;Autres fonctionnalités;Altre funzionalità;Weitere Funktionen;Outras funcionalidades;その他の機能;기타 기능;其他功能;其他功能
Configure online streaming settings;Configurar ajustes de streaming online;Configurer les paramètres de streaming en ligne;Configura le impostazioni di streaming online;Online-Streaming-Einstellungen konfigurieren;Configurar configurações de streaming online;オンラインストリーミング設定を構成;온라인 스트리밍 설정 구성;配置在线视频播放设置;設定線上串流設定
Watch anime episodes from online sources.;Ver episodios de anime desde fuentes online.;Regarder des épisodes d'anime depuis des sources en ligne.;Guarda episodi di anime da fonti online.;Anime-Episoden aus Online-Quellen ansehen.;Assistir episódios de anime de fontes online.;オンラインソースからアニメエピソードを見る;온라인 소스에서 애니메이션 에피소드 보기;从在线来源观看动漫;從線上來源觀看動畫劇集。
Manage your manga library;Gestionar tu biblioteca de manga;Gérer votre bibliothèque de manga;Gestisci la tua libreria manga;Verwalte deine Manga-Bibliothek;Gerenciar sua biblioteca de mangá;マンガライブラリを管理;만화 라이브러리 관리;管理你的漫画库;管理你的漫畫資料庫
Read manga series, download chapters and track your progress.;Leer series de manga, descargar capítulos y seguir tu progreso.;Lire des séries de manga, télécharger des chapitres et suivre votre progression.;Leggi serie manga, scarica capitoli e traccia i tuoi progressi.;Manga-Serien lesen, Kapitel herunterladen und Fortschritt verfolgen.;Ler séries de mangá, baixar capítulos e acompanhar seu progresso.;マンガシリーズを読んで、章をダウンロードし、進捗を追跡;만화 시리즈 읽기, 챕터 다운로드 및 진행 상황 추적;阅读漫画系列，下载章节并跟踪进度;閱讀漫畫系列、下載章節並追蹤你的進度。
If enabled, your progress will be automatically updated when you reach the end of a chapter.;Si está activado, tu progreso se actualizará automáticamente al terminar un capítulo.;Si activé, votre progression sera mise à jour automatiquement lorsque vous atteindrez la fin d'un chapitre.;Se abilitato, il tuo progresso sarà aggiornato automaticamente al termine di un capitolo.;Wenn aktiviert, wird dein Fortschritt automatisch aktualisiert, wenn du das Ende eines Kapitels erreichst.;Se ativado, seu progresso será atualizado automaticamente ao terminar um capítulo.;有効にすると、章の終わりに達したときに進捗が自動更新されます;활성화하면 챕터 끝에 도달할 때 진행 상황이 자동 업데이트됩니다;启用后，到达章节末尾时会自动更新进度;若啟用，當你閱讀至章節結尾時，進度將自動更新。
Sources;Fuentes;Sources;Fonti;Quellen;Fontes;ソース;소스;来源;來源
Default Provider;Proveedor predeterminado;Fournisseur par défaut;Provider predefinito;Standardanbieter;Provedor padrão;デフォルトプロバイダ;기본 제공자;默认提供者;預設提供者
Select the default provider for manga series.;Selecciona el proveedor predeterminado para series de manga.;Sélectionnez le fournisseur par défaut pour les séries de manga.;Seleziona il provider predefinito per le serie manga.;Wählen Sie den Standardanbieter für Manga-Serien.;Selecione o provedor padrão para séries de mangá.;マンガシリーズのデフォルトプロバイダを選択;만화 시리즈 기본 제공자 선택;选择漫画系列的默认提供者;選擇漫畫系列的預設提供者。
Local Source Directory;Directorio de fuentes local;Répertoire source local;Directory sorgente locale;Lokales Quellverzeichnis;Diretório de fonte local;ローカルソースディレクトリ;로컬 소스 디렉터리;本地资源目录;本機來源目錄
The directory where your manga is stored. This is only used for local manga provider.;Directorio donde se almacena tu manga. Solo usado para proveedor local.;Répertoire où votre manga est stocké. Utilisé uniquement pour le fournisseur local.;La directory in cui è memorizzato il tuo manga. Usato solo per il provider locale.;Verzeichnis, in dem dein Manga gespeichert ist. Wird nur für lokalen Anbieter verwendet.;Diretório onde seu mangá está armazenado. Usado apenas para provedor local.;マンガが保存されているディレクトリ。ローカルプロバイダのみ使用;만화가 저장된 디렉토리. 로컬 프로바이더에만 사용;漫画存放目录，仅用于本地漫画提供者;你的漫畫儲存目錄。僅用於本機漫畫提供者。
Communicate with other Seanime instances;Comunicarte con otras instancias de Seanime;Communiquer avec d'autres instances Seanime;Comunica con altre istanze di Seanime;Mit anderen Seanime-Instanzen kommunizieren;Comunicar com outras instâncias do Seanime;他のSeanimeインスタンスと通信;다른 Seanime 인스턴스와 통신;与其他Seanime实例通信;與其他 Seanime 實例通訊
Enable Nakama;Activar Nakama;Activer Nakama;Abilita Nakama;Nakama aktivieren;Ativar Nakama;Nakamaを有効にする;Nakama 활성화;启用Nakama;啟用 Nakama
The username to identify this server to other instances. If empty a random ID will be assigned.;Nombre de usuario para identificar este servidor ante otras instancias. Si está vacío se asignará un ID aleatorio.;Nom d'utilisateur pour identifier ce serveur auprès des autres instances. Si vide, un ID aléatoire sera attribué.;Nome utente per identificare questo server alle altre istanze. Se vuoto verrà assegnato un ID casuale.;Benutzername, um diesen Server anderen Instanzen zu identifizieren. Leer = zufällige ID.;Nome de usuário para identificar este servidor para outras instâncias. Se vazio, será atribuído um ID aleatório.;他のインスタンスにこのサーバーを識別するためのユーザー名。空欄の場合、ランダムIDが割り当てられます;이 서버를 다른 인스턴스에 식별할 사용자 이름. 비어 있으면 랜덤 ID가 할당됩니다;用于向其他实例识别此服务器的用户名。为空时将分配随机ID;用於讓其他實例識別此伺服器的使用者名稱。若留空，將隨機分配 ID。
Connect to a host;Conectarse a un host;Se connecter à un hôte;Connettersi a un host;Mit einem Host verbinden;Conectar a um host;ホストに接続;호스트에 연결;连接到主机;連線至主機
The server you're connecting to must be accessible over the internet.;El servidor al que te conectas debe ser accesible desde Internet.;Le serveur auquel vous vous connectez doit être accessible via Internet.;Il server a cui ti connetti deve essere accessibile tramite Internet.;Der Server, zu dem Sie eine Verbindung herstellen, muss über das Internet erreichbar sein.;O servidor ao qual você se conecta deve ser acessível pela internet.;接続先サーバーはインターネット経由でアクセス可能である必要があります;연결하려는 서버는 인터넷에서 접근 가능해야 합니다;你要连接的服务器必须可通过互联网访问;你所連線的伺服器必須可透過網際網路存取。
Nakama Server URL;URL del servidor Nakama;URL du serveur Nakama;URL del server Nakama;Nakama-Server-URL;URL do servidor Nakama;NakamaサーバーURL;Nakama 서버 URL;Nakama服务器URL;Nakama 伺服器網址
Nakama Passcode;Código Nakama;Code Nakama;Codice Nakama;Nakama-Passcode;Código Nakama;Nakamaパスコード;Nakama 패스코드;Nakama通行码;Nakama 通行碼
If enabled, the Nakama's anime library will be used as your library if it is being shared.;Si está activado, se usará la biblioteca de anime de Nakama como tu biblioteca si se está compartiendo.;Si activé, la bibliothèque anime de Nakama sera utilisée comme votre bibliothèque si elle est partagée.;Se abilitato, la libreria anime di Nakama sarà usata come tua libreria se condivisa.;Wenn aktiviert, wird die Nakama-Anime-Bibliothek als eigene verwendet, wenn sie geteilt wird.;Se ativado, a biblioteca de anime do Nakama será usada como sua biblioteca se estiver sendo compartilhada.;有効にすると、Nakamaのアニメライブラリが共有されていれば自分のライブラリとして使用されます;활성화하면 Nakama의 애니메이션 라이브러리가 공유 중일 경우 내 라이브러리로 사용됩니다;启用后，如果Nakama的动漫库正在共享，将作为你的库使用;若啟用，若 Nakama 的動畫資料庫已分享，將作為你的資料庫使用。
Use Nakama's anime library;Usar la biblioteca de anime de Nakama;Utiliser la bibliothèque anime de Nakama;Usa la libreria anime di Nakama;Nakama-Anime-Bibliothek verwenden;Usar a biblioteca de anime do Nakama;Nakamaのアニメライブラリを使用;Nakama의 애니메이션 라이브러리 사용;使用Nakama的动漫库;使用 Nakama 的動畫資料庫
Your server is not password protected. Add a password to your config file.;Tu servidor no tiene contraseña. Agrega una contraseña a tu archivo de configuración.;Votre serveur n'est pas protégé par mot de passe. Ajoutez un mot de passe à votre fichier de configuration.;Il tuo server non è protetto da password. Aggiungi una password al file di configurazione.;Ihr Server ist nicht passwortgeschützt. Fügen Sie eine Passwort in Ihre Konfigurationsdatei ein.;Seu servidor não está protegido por senha. Adicione uma senha ao arquivo de configuração.;サーバーにパスワードが設定されていません。設定ファイルにパスワードを追加してください;서버에 비밀번호가 없습니다. 설정 파일에 비밀번호를 추가하세요;你的服务器没有密码保护。请在配置文件中添加密码;你的伺服器未受密碼保護。請在設定檔中新增密碼。
Enable host mode;Activar modo host;Activer le mode hôte;Abilita modalità host;Host-Modus aktivieren;Ativar modo host;ホストモードを有効にする;호스트 모드 활성화;启用主机模式;啟用主機模式
If enabled, this server will act as a host for other clients. This requires a host password to be set.;Si está activado, este servidor actuará como host para otros clientes. Esto requiere establecer una contraseña de host.;Si activé, ce serveur agira comme hôte pour d'autres clients. Cela nécessite un mot de passe hôte.;Se abilitato, questo server agirà come host per altri client. Richiede una password host.;Wenn aktiviert, fungiert dieser Server als Host für andere Clients. Ein Host-Passwort muss gesetzt sein.;Se ativado, este servidor atuará como host para outros clientes. Isso requer uma senha de host.;有効にすると、このサーバーは他のクライアントのホストとして機能します。ホストパスワードが必要です;활성화하면 이 서버가 다른 클라이언트의 호스트로 작동합니다. 호스트 비밀번호 필요;启用后，此服务器将作为其他客户端的主机。这需要设置主机密码;若啟用，此伺服器將作為其他客戶端的主機。此功能需要設定主機密碼。
Host Passcode;Contraseña del host;Code hôte;Passcode host;Host-Passcode;Senha do host;ホストパスコード;호스트 패스코드;主机通行码;主機通行碼
Set a passcode to secure your host mode. This passcode should be different than your server password.;Establece una contraseña para proteger tu modo host. Esta contraseña debe ser diferente a la de tu servidor.;Définissez un code pour sécuriser votre mode hôte. Ce code doit être différent du mot de passe serveur.;Imposta un passcode per proteggere la modalità host. Questo passcode dovrebbe essere diverso dalla password del server.;Legen Sie einen Passcode fest, um den Host-Modus zu sichern. Dieser Passcode sollte sich vom Server-Passwort unterscheiden.;Defina uma senha para proteger seu modo host. Esta senha deve ser diferente da senha do servidor.;ホストモードを保護するパスコードを設定。このパスコードはサーバーパスワードと異なる必要があります;호스트 모드를 보호할 패스코드를 설정하세요. 서버 비밀번호와 달라야 합니다;设置通行码以保护主机模式。此通行码应与服务器密码不同;設定通行碼以保護主機模式。此通行碼應與伺服器密碼不同。
Configure Discord rich presence settings;Configurar ajustes de Discord rich presence;Configurer les paramètres Discord Rich Presence;Configura le impostazioni Discord Rich Presence;Discord Rich Presence-Einstellungen konfigurieren;Configurar configurações do Discord Rich Presence;Discordリッチプレゼンスの設定を構成;Discord Rich Presence 설정 구성;配置Discord Rich Presence设置;設定 Discord 狀態整合
Show what you are watching or reading in Discord.;Mostrar lo que estás viendo o leyendo en Discord.;Afficher ce que vous regardez ou lisez dans Discord.;Mostra cosa stai guardando o leggendo in Discord.;Anzeigen, was du in Discord siehst oder liest.;Mostrar o que você está assistindo ou lendo no Discord.;Discordで見ているものや読んでいるものを表示;Discord에서 보고 있는 내용 또는 읽고 있는 내용 표시;在Discord显示你正在观看或阅读的内容;在 Discord 顯示你正在觀看或閱讀的內容。
Hide Seanime Repository Button;Ocultar botón de repositorio de Seanime;Masquer le bouton du dépôt Seanime;Nascondi pulsante repository Seanime;Seanime-Repository-Button ausblenden;Ocultar botão do repositório Seanime;Seanimeリポジトリボタンを非表示;Seanime 저장소 버튼 숨기기;隐藏Seanime仓库按钮;隱藏 Seanime 儲存庫按鈕
Show a button to open your profile page on AniList.;Mostrar un botón para abrir tu página de perfil en AniList.;Afficher un bouton pour ouvrir votre profil AniList.;Mostra un pulsante per aprire la tua pagina profilo su AniList.;Zeige einen Button, um dein AniList-Profil zu öffnen.;Mostrar um botão para abrir sua página de perfil no AniList.;AniListのプロフィールページを開くボタンを表示;AniList 프로필 페이지 열기 버튼 표시;显示打开AniList个人资料页面的按钮;顯示按鈕以開啟你的 AniList 個人頁面。
Show AniList Profile Button;Mostrar botón de perfil de AniList;Afficher le bouton profil AniList;Mostra pulsante profilo AniList;AniList-Profil-Button anzeigen;Mostrar botão de perfil do AniList;AniListプロフィールボタンを表示;AniList 프로필 버튼 표시;显示AniList个人资料按钮;顯示 AniList 個人資料按鈕
Server & Interface;Servidor e interfaz;Serveur & Interface;Server e Interfaccia;Server & Oberfläche;Servidor e Interface;サーバーとインターフェース;서버 및 인터페이스;服务器与界面;伺服器與介面
Theme;Tema;Thème;Tema;Thema;Tema;テーマ;테마;主题;主題
Media;Medios;Médias;Media;Medien;Mídia;メディア;미디어;媒体;媒體
Navigation;Navegación;Navigation;Navigazione;Navigation;Navegação;ナビゲーション;탐색;导航;導覽
Rendering;Renderizado;Rendu;Rendering;Rendering;Renderização;レンダリング;렌더링;渲染;渲染
Color scheme;Esquema de colores;Schéma de couleurs;Schema colori;Farbgestaltung;Esquema de cores;カラースキーム;색상 구성;配色方案;配色方案
Enable color settings;Activar configuración de colores;Activer les paramètres de couleur;Abilita impostazioni colore;Farboptionen aktivieren;Ativar configurações de cor;カラー設定を有効にする;색상 설정 활성화;启用颜色设置;啟用顏色設定
Image path;Ruta de imagen;Chemin de l'image;Percorso immagine;Bildpfad;Caminho da imagem;画像パス;이미지 경로;图片路径;圖片路徑
Background image for all pages. Dimmed on non-library screens.;Imagen de fondo para todas las páginas. Atenuada en pantallas que no son de la biblioteca.;Image de fond pour toutes les pages. Atténuée sur les écrans hors bibliothèque.;Immagine di sfondo per tutte le pagine. Dimmerata sulle schermate non della libreria.;Hintergrundbild für alle Seiten. Abgedunkelt auf Nicht-Bibliotheksbildschirmen.;Imagem de fundo para todas as páginas. Escurecida em telas não da biblioteca.;全ページの背景画像。ライブラリ以外の画面では暗く表示;모든 페이지 배경 이미지. 라이브러리 외 화면에서 어둡게 표시;所有页面的背景图。在非库界面上会变暗;所有頁面的背景圖片。在非資料庫畫面上將被調暗。
Banner image;Imagen de banner;Image de bannière;Immagine banner;Bannerbild;Imagem do banner;バナー画像;배너 이미지;横幅图片;橫幅圖片
Position;Posición;Position;Posizione;Position;Posição;位置;위치;位置;位置
Opacity;Opacidad;Opacité;Opacità;Deckkraft;Opacidade;不透明度;투명도;不透明度;透明度
Banner image for all pages.;Imagen de banner para todas las páginas.;Image de bannière pour toutes les pages.;Immagine banner per tutte le pagine.;Bannerbild für alle Seiten.;Imagem do banner para todas as páginas.;全ページのバナー画像;모든 페이지 배너 이미지;所有页面的横幅图片;所有頁面的橫幅圖片。
The custom CSS will be saved on the server and needs to be applied manually to each client.;El CSS personalizado se guardará en el servidor y debe aplicarse manualmente en cada cliente.;Le CSS personnalisé sera enregistré sur le serveur et doit être appliqué manuellement à chaque client.;Il CSS personalizzato verrà salvato sul server e deve essere applicato manualmente a ciascun client.;Das benutzerdefinierte CSS wird auf dem Server gespeichert und muss manuell auf jedem Client angewendet werden.;O CSS personalizado será salvo no servidor e precisa ser aplicado manualmente em cada cliente.;カスタムCSSはサーバーに保存され、各クライアントに手動で適用する必要があります;사용자 정의 CSS는 서버에 저장되며 각 클라이언트에 수동으로 적용해야 합니다;自定义CSS将保存在服务器上，需要手动应用到每个客户端;自訂 CSS 將儲存在伺服器上，需手動套用至每個客戶端。
In case of an error rendering the UI unusable, you can always remove it from the local storage using the devtools.;En caso de error que haga inutilizable la UI, siempre puedes eliminarlo del almacenamiento local usando las devtools.;En cas d'erreur rendant l'UI inutilisable, vous pouvez toujours le supprimer du stockage local via les devtools.;In caso di errore che renda inutilizzabile l'interfaccia, puoi sempre rimuoverlo dallo storage locale usando i devtools.;Im Falle eines Fehlers, der die UI unbrauchbar macht, können Sie es immer über die Devtools aus dem lokalen Speicher entfernen.;Em caso de erro que torne a UI inutilizável, você sempre pode removê-lo do armazenamento local usando os devtools.;UIが使用不能になるエラーが発生した場合、devtoolsを使ってローカルストレージから削除可能;UI를 사용할 수 없게 하는 오류가 발생하면 devtools를 사용하여 로컬 스토리지에서 제거할 수 있습니다;如果渲染UI出错导致无法使用，可以通过开发者工具从本地存储中删除;若渲染錯誤導致介面無法使用，可透過開發者工具從本機儲存中移除。
Applied above 1024px screen size.;Aplicado en pantallas mayores a 1024px.;Appliqué pour les écrans supérieurs à 1024px.;Applicato per schermi sopra 1024px.;Über 1024px Bildschirmgröße angewendet.;Aplicado em telas acima de 1024px.;1024px以上の画面サイズに適用;1024px 이상 화면 크기에 적용;应用于1024px以上屏幕;應用於螢幕尺寸大於 1024px。
Applied below 1024px screen size.;Aplicado en pantallas menores a 1024px.;Appliqué pour les écrans inférieurs à 1024px.;Applicato per schermi sotto 1024px.;Unter 1024px Bildschirmgröße angewendet.;Aplicado em telas abaixo de 1024px.;1024px未満の画面サイズに適用;1024px 미만 화면 크기에 적용;应用于1024px以下屏幕;應用於螢幕尺寸小於 1024px。
Collection screens;Pantallas de colección;Écrans de collection;Schermate della collezione;Sammlungsbildschirme;Telas de coleção;コレクション画面;컬렉션 화면;合集界面;收藏畫面
Banner type;Tipo de banner;Type de bannière;Tipo di banner;Banner-Typ;Tipo de banner;バナータイプ;배너 유형;横幅类型;橫幅類型
Dynamic Banner;Banner dinámico;Bannière dynamique;Banner dinamico;Dynamisches Banner;Banner dinâmico;動的バナー;동적 배너;动态横幅;動態橫幅
Custom Banner;Banner personalizado;Bannière personnalisée;Banner personalizzato;Benutzerdefinierter Banner;Banner personalizado;カスタムバナー;맞춤 배너;自定义横幅;自訂橫幅
Remove genre selector;Quitar selector de género;Supprimer le sélecteur de genre;Rimuovi selettore di genere;Genre-Selector entfernen;Remover seletor de gênero;ジャンルセレクターを削除;장르 선택기 제거;移除类型选择器;移除類型選擇器
Continue watching sorting;Ordenar "seguir viendo";Trier "continuer à regarder";Ordina "continua a guardare";Sortierung "Weiter schauen";Ordenar "Continuar assistindo";「視聴を続ける」を並べ替え;계속 보기 정렬;继续观看排序;繼續觀看排序
Aired recently;Emitido recientemente;Diffusé récemment;Trasmesso di recente;Kürzlich ausgestrahlt;Transmitido recentemente;最近放送;최근 방영;最近播出;最近播出
Aired oldest;Más viejos;Diffusé en premier;Trasmesso prima;Zuerst ausgestrahlt;Transmitido primeiro;最初に放送;먼저 방영;最早播出;最早播出
Highest episode number;Número de episodio más alto;Numéro d'épisode le plus élevé;Numero episodio più alto;Höchste Episodennummer;Número do episódio mais alto;最高話数;최고 화수;最高集数;最高集數
Lower episode number;Número de episodio más bajo;Numéro d'épisode le plus bas;Numero episodio più basso;Niedrigste Episodennummer;Número do episódio mais baixo;最小話数;최저 화수;最低集数;最低集數
Most unwatched episodes;Más episodios sin ver;Le plus d'épisodes non vus;Più episodi non visti;Meiste ungesehene Episoden;Mais episódios não assistidos;未視聴エピソードが最も多い;가장 많이 안 본 에피소드;最多未观看集数;最多未觀看集數
Least unwatched episodes;Menos episodios sin ver;Le moins d'épisodes non vus;Meno episodi non visti;Wenigste ungesehene Episoden;Menos episódios não assistidos;未視聴エピソードが最も少ない;가장 적게 안 본 에피소드;最少未观看集数;最少未觀看集數
Started recently;Comenzado recientemente;Commencé récemment;Iniziato di recente;Kürzlich gestartet;Começado recentemente;最近開始;최근 시작;最近开始;最近開始
Oldest start date;Fecha de inicio más antigua;Date de début la plus ancienne;Data di inizio più vecchia;Ältestes Startdatum;Data de início mais antiga;最古の開始日;가장 오래된 시작일;最早开始日期;最早開始日期
Most recent watch;Último visto;Dernière lecture;Visione più recente;Zuletzt angesehen;Última visualização;最新視聴;최근 시청;最近观看;最近觀看
Least recent watch;Menos reciente;Moins récent;Meno recente;Am wenigsten kürzlich angesehen;Menos recente;最も古い視聴;가장 오래된 시청;最久未观看;最久未觀看
Anime library sorting;Ordenar biblioteca de anime;Tri de la bibliothèque anime;Ordinamento libreria anime;Anime-Bibliothek sortieren;Ordenar biblioteca de anime;アニメライブラリの並び替え;애니메이션 라이브러리 정렬;动漫库排序;動畫資料庫排序
Manga library sorting;Ordenar biblioteca de manga;Tri de la bibliothèque manga;Ordinamento libreria manga;Manga-Bibliothek sortieren;Ordenar biblioteca de mangá;マンガライブラリの並び替え;만화 라이브러리 정렬;漫画库排序;漫畫資料庫排序
Media page;Página de medios;Page média;Pagina media;Medienseite;Página de mídia;メディアページ;미디어 페이지;媒体页面;媒體頁面
AniList banner image;Imagen de banner de AniList;Image de bannière AniList;Immagine banner AniList;AniList-Bannerbild;Imagem do banner AniList;AniListバナー画像;AniList 배너 이미지;AniList横幅图片;AniList 橫幅圖片
Blur;Desenfocar;Flou;Flou;Weichzeichnen;Desfocar;ぼかす;흐리게;模糊;模糊
Hide;Ocultar;Cacher;Nascondi;Verbergen;Ocultar;隠す;숨기기;隐藏;隱藏
Always show a banner image. If not available, the cover image will be used instead.;Siempre mostrar banner. Si no hay, se usa la portada.;Toujours afficher une bannière. Si indisponible, la couverture sera utilisée.;Mostra sempre il banner. Se non disponibile, verrà usata la cover.;Immer Bannerbild anzeigen. Wenn nicht verfügbar, wird das Cover genutzt.;Sempre mostrar banner. Se não disponível, usa a capa.;常にバナー画像を表示。なければカバー画像を使用;항상 배너 이미지 표시. 없으면 표지 이미지 사용;总是显示横幅图片。如果没有则使用封面;永遠顯示橫幅圖片；若無橫幅，將使用封面圖片代替。
Banner size;Tamaño del banner;Taille de la bannière;Dimensione banner;Bannergröße;Tamanho do banner;バナーサイズ;배너 크기;横幅大小;橫幅大小
Larger;Más grande;Plus grand;Più grande;Größer;Maior;大;더 크게;更大;較大
Smaller;Más pequeño;Plus petit;Più piccolo;Kleiner;Menor;小;더 작게;更小;較小
Fill a large portion of the screen.;Ocupa gran parte de la pantalla.;Remplit une grande partie de l'écran.;Riempi gran parte dello schermo.;Füllt einen großen Teil des Bildschirms.;Preenche grande parte da tela.;画面の大部分を埋める;화면의 큰 부분 채우기;填充屏幕大部分;填滿螢幕的大部分區域。
Banner info layout;Diseño info del banner;Mise en page infos bannière;Layout info banner;Banner-Info-Layout;Layout info do banner;バナー情報レイアウト;배너 정보 레이아웃;横幅信息布局;橫幅資訊佈局
Fluid;Fluido;Fluide;Fluido;Flüssig;Fluido;フルイド;유동적;流动;流動式
Boxed;En caja;Encadré;In box;Gekästelt;Em caixa;ボックス;박스;盒装;方框式
Can cause performance issues.;Puede afectar rendimiento.;Peut causer des problèmes de performance.;Può causare problemi di prestazioni.;Kann die Leistung beeinträchtigen.;Pode causar problemas de desempenho.;パフォーマンスに影響する場合があります;성능 문제 발생 가능;可能影响性能;可能導致效能問題。
Blurred gradient background;Fondo degradado desenfocado;Fond dégradé flou;Sfondo sfumato sfocato;Unschärfe-Verlaufshintergrund;Fundo degradê desfocado;ぼかしグラデ背景;흐린 그라디언트 배경;模糊渐变背景;模糊漸層背景
Media card;Tarjeta de medios;Carte média;Scheda media;Medienkarte;Cartão de mídia;メディアカード;미디어 카드;媒体卡;媒體卡片
Show anime unwatched count;Mostrar conteo de anime sin ver;Afficher le nombre d'animes non vus;Mostra conteggio anime non visti;Anzahl ungesehener Anime anzeigen;Mostrar contagem de anime não assistido;アニメ未視聴数を表示;안 본 애니 수 표시;显示未观看动漫数量;顯示動畫未觀看數量
Show manga unread count;Mostrar conteo de manga no leído;Afficher le nombre de mangas non lus;Mostra conteggio manga non letti;Anzahl ungelesener Manga anzeigen;Mostrar contagem de mangá não lido;マンガ未読数を表示;읽지 않은 만화 수 표시;显示未读漫画数量;顯示漫畫未閱讀數量
Glassy background;Fondo translúcido;Fond transparent;Sfondo trasparente;Gläserner Hintergrund;Fundo translúcido;ガラス風背景;유리 배경;玻璃背景;玻璃效果背景
Episode card;Tarjeta de episodio;Carte épisode;Scheda episodio;Episodenkarte;Cartão de episódio;エピソードカード;에피소드 카드;剧集卡片;劇集卡片
Show anime info;Mostrar info del anime;Afficher infos anime;Mostra info anime;Anime-Infos anzeigen;Mostrar info do anime;アニメ情報を表示;애니메이션 정보 표시;显示动漫信息;顯示動畫資訊
Hide episode summary;Ocultar resumen del episodio;Cacher résumé de l'épisode;Nascondi riepilogo episodio;Episodenzusammenfassung ausblenden;Ocultar resumo do episódio;エピソード概要を非表示;에피소드 요약 숨기기;隐藏剧集简介;隱藏劇集摘要
Hide downloaded episode filename;Ocultar nombre de archivo del episodio descargado;Cacher le nom du fichier de l'épisode téléchargé;Nascondi nome file episodio scaricato;Heruntergeladene Episoden-Datei ausblenden;Ocultar nome do arquivo do episódio baixado;ダウンロード済みエピソードのファイル名を非表示;다운로드된 에피소드 파일 이름 숨기기;隐藏已下载剧集文件名;隱藏已下載劇集的檔名
Carousel;Carrusel;Carrousel;Carosello;Karussell;Carrossel;カルーセル;캐러셀;轮播;輪播
Disable auto-scroll;Desactivar desplazamiento automático;Désactiver le défilement automatique;Disabilita scorrimento automatico;Automatisches Scrollen deaktivieren;Desativar rolagem automática;自動スクロールを無効;자동 스크롤 비활성화;禁用自动滚动;停用自動滾動
Smaller episode cards;Tarjetas de episodio más pequeñas;Cartes épisode plus petites;Schede episodio più piccole;Kleinere Episodenkarten;Cartões de episódio menores;小さいエピソードカード;작은 에피소드 카드;更小剧集卡片;較小的劇集卡片
Causes visual glitches with plugin tray.;Puede causar fallos visuales en la bandeja de plugins.;Peut provoquer des problèmes visuels avec le tray plugin.;Può causare glitch visivi con il tray dei plugin.;Kann visuelle Fehler im Plugin-Tray verursachen.;Pode causar falhas visuais na bandeja de plugins.;プラグイントレイで表示不具合が起こる場合があります;플러그인 트레이 시각적 오류 발생 가능;可能导致插件托盘显示异常;可能導致外掛列顯示異常。
Expand sidebar on hover;Expandir barra lateral al pasar el cursor;Développer la barre latérale au survol;Espandi barra laterale al passaggio del mouse;Seitenleiste bei Hover erweitern;Expandir barra lateral ao passar o mouse;ホバーでサイドバーを展開;호버 시 사이드바 확장;悬停展开侧边栏;滑鼠懸停時展開側邊欄
Disable transparency;Desactivar transparencia;Désactiver la transparence;Disabilita trasparenza;Transparenz deaktivieren;Desativar transparência;透過を無効にする;투명도 비활성화;禁用透明;停用透明效果
Unpinned menu items;Elementos de menú no fijados;Éléments de menu non épinglés;Voci di menu non fissate;Nicht angeheftete Menüelemente;Itens de menu não fixados;固定されていないメニュー項目;고정되지 않은 메뉴 항목;未固定菜单项;未固定的選單項目
Navbar;Barra de navegación;Barre de navigation;Barra di navigazione;Navigationsleiste;Barra de navegação;ナビバー;내비게이션 바;导航栏;導覽列
Switches to sidebar-only mode.;Cambiar a modo solo barra lateral.;Basculer en mode barre latérale uniquement.;Passa in modalità solo barra laterale.;Wechselt in den Nur-Seitenleisten-Modus.;Alterna para modo apenas barra lateral.;サイドバーのみモードに切り替え;사이드바 전용 모드로 전환;切换为仅侧边栏模式;切換為僅側邊欄模式。
Hide top navbar;Ocultar barra superior;Cacher la barre supérieure;Nascondi barra superiore;Obere Navbar ausblenden;Ocultar barra superior;トップナビバーを非表示;상단 내비게이션 숨기기;隐藏顶部导航栏;隱藏頂部導覽列
Seanime will try to fix border rendering artifacts. This setting only affects this client/browser.;Seanime intentará corregir artefactos de bordes. Solo afecta a este cliente/navegador.;Seanime essaiera de corriger les artefacts de bordure. Affecte uniquement ce client/navigateur.;Seanime proverà a correggere artefatti dei bordi. Solo per questo client/browser.;Seanime versucht, Randdarstellungsfehler zu beheben. Gilt nur für diesen Client/Browser.;Seanime tentará corrigir artefatos de borda. Afeta apenas este cliente/navegador.;Seanimeは境界レンダリングのアーティファクトを修正しようとします。この設定はこのクライアント/ブラウザにのみ影響;Seanime가 테두리 렌더링 아티팩트를 수정하려고 시도합니다. 이 설정은 이 클라이언트/브라우저에만 적용;Seanime会尝试修复边框渲染问题，仅影响此客户端/浏览器;Seanime 將嘗試修正邊框渲染問題。此設定僅影響當前用戶端/瀏覽器。
Fix border rendering aartifacts (client-specific);Corregir artefactos de borde (específico del cliente);Corriger les artefacts de bord (client spécifique);Correggi artefatti dei bordi (specifico client);Randdarstellungsfehler beheben (client-spezifisch);Corrigir artefatos de borda (específico do cliente);境界レンダリングのアーティファクトを修正（クライアント固有）;테두리 렌더링 아티팩트 수정(클라이언트 전용);修复边框渲染问题（客户端专用）;修正邊框渲染瑕疵（用戶端特定）
Logs;Registros;Journaux;Log;Protokolle;Logs;ログ;로그;日志;日誌
Logs & Cache;Registros y caché;Journaux & Cache;Log & Cache;Protokolle & Cache;Logs e cache;ログとキャッシュ;로그 및 캐시;日志和缓存;日誌與快取
Copy current server logs;Copiar registros actuales del servidor;Copier les journaux actuels du serveur;Copia log server corrente;Aktuelle Serverprotokolle kopieren;Copiar logs do servidor atual;現在のサーバーログをコピー;현재 서버 로그 복사;复制当前服务器日志;複製目前伺服器日誌
Name;Nombre;Nom;Nome;Name;Nome;名前;이름;名称;名稱
Server;Servidor;Serveur;Server;Server;Servidor;サーバー;서버;服务器;伺服器
Scanner;Escáner;Scanner;Scanner;Scanner;Scanner;スキャナー;스캐너;扫描器;掃描器
Page;Página;Page;Pagina;Seite;Página;ページ;페이지;页面;頁面
Profiling;Perfilado;Profilage;Profiling;Profiling;Perfilamento;プロファイリング;프로파일링;分析;效能分析
Memory Statistics;Estadísticas de memoria;Statistiques mémoire;Statistiche memoria;Speicherstatistiken;Estatísticas de memória;メモリ統計;메모리 통계;内存统计;記憶體統計
Force GC;Forzar GC;Forcer GC;Forza GC;GC erzwingen;Forçar GC;GCを強制;GC 강제 실행;强制GC;強制垃圾回收
Click "Refresh" to load memory statistics;Haz clic en "Actualizar" para cargar estadísticas de memoria;Cliquez sur "Actualiser" pour charger les statistiques mémoire;Clicca su "Aggiorna" per caricare le statistiche della memoria;Klicke auf "Aktualisieren", um Speicherstatistiken zu laden;Clique em "Atualizar" para carregar estatísticas de memória;Actualizarをクリックしてメモリ統計を読み込む;새로 고침을 클릭하여 메모리 통계 로드;刷新以加载内存统计;點擊「重新整理」以載入記憶體統計
Memory;Memoria;Mémoire;Memoria;Speicher;Memória;メモリ;메모리;内存;記憶體
Heap Profile;Perfil de heap;Profil du tas;Profilo heap;Heap-Profil;Perfil de heap;ヒーププロファイル;힙 프로필;堆概况;堆積分析
Allocations Profile;Perfil de asignaciones;Profil des allocations;Profilo allocazioni;Allocations-Profil;Perfil de alocações;割り当てプロファイル;할당 프로필;分配概况;配置分析
Goroutine Profile;Perfil de Goroutine;Profil des Goroutines;Profilo Goroutine;Goroutine-Profil;Perfil de Goroutine;ゴルーチンプロファイル;고루틴 프로필;Goroutine概况;執行緒分析
Duration (seconds);Duración (segundos);Durée (secondes);Durata (secondi);Dauer (Sekunden);Duração (segundos);期間（秒）;기간(초);持续时间（秒）;持續時間（秒）
CPU profiling will run for the specified duration (1-300 seconds);El perfilado de CPU se ejecutará durante la duración especificada (1-300 segundos);Le profil CPU s'exécutera pendant la durée spécifiée (1-300 secondes);Il profiling CPU verrà eseguito per la durata specificata (1-300 secondi);CPU-Profiling läuft für die angegebene Dauer (1-300 Sekunden);O perfil de CPU será executado pela duração especificada (1-300 segundos);CPUプロファイリングは指定した時間実行されます（1-300秒）;CPU 프로파일링이 지정된 기간 동안 실행됩니다(1-300초);CPU分析将在指定时间内运行（1-300秒）;CPU 分析將在指定時間內運行（1-300 秒）
Download CPU Profile;Descargar perfil de CPU;Télécharger le profil CPU;Scarica profilo CPU;CPU-Profil herunterladen;Baixar perfil de CPU;CPUプロファイルをダウンロード;CPU 프로필 다운로드;下载CPU概况;下載 CPU 分析
Cache;Caché;Cache;Cache;Cache;Cache;キャッシュ;캐시;缓存;快取
Manage the cache;Gestionar la caché;Gérer le cache;Gestisci cache;Cache verwalten;Gerenciar cache;キャッシュ管理;캐시 관리;管理缓存;管理快取
Features;Funciones;Fonctionnalités;Funzionalità;Funktionen;Recursos;機能;기능;功能;功能
Episode image metadata fetched from TVDB.;Metadatos de imagen del episodio obtenidos de TVDB.;Métadonnées de l'image de l'épisode récupérées depuis TVDB.;Metadati immagine episodio presi da TVDB.;Episoden-Bildmetadaten von TVDB abgerufen.;Metadados de imagem do episódio obtidos do TVDB.;エピソード画像メタデータはTVDBから取得;에피소드 이미지 메타데이터 TVDB에서 가져옴;从TVDB获取剧集图片元数据;從 TVDB 取得劇集圖片中繼資料。
Clear metadata;Borrar metadatos;Effacer les métadonnées;Cancella metadati;Metadaten löschen;Limpar metadados;メタデータをクリア;메타데이터 지우기;清除元数据;清除中繼資料
Clear manga cache;Borrar caché de manga;Effacer le cache manga;Cancella cache manga;Manga-Cache löschen;Limpar cache de mangá;マンガキャッシュをクリア;만화 캐시 지우기;清除漫画缓存;清除漫畫快取
Clear media streaming cache;Borrar caché de streaming;Effacer le cache streaming média;Cancella cache streaming media;Streaming-Cache löschen;Limpar cache de streaming de mídia;メディアストリーミングキャッシュをクリア;미디어 스트리밍 캐시 지우기;清除媒体流缓存;清除媒體串流快取
Clear online streaming cache;Borrar caché de streaming online;Effacer le cache streaming en ligne;Cancella cache streaming online;Online-Streaming-Cache löschen;Limpar cache de streaming online;オンラインストリーミングキャッシュをクリア;온라인 스트리밍 캐시 지우기;清除在线视频缓存;清除線上串流快取
Tray plugins;Plugins de bandeja;Plugins de la barre système;Plugin tray;Tray-Plugins;Plugins da bandeja;トレイプラグイン;트레이 플러그인;托盘插件;外掛工具列
Invalid extensions;Extensiones inválidas;Extensions invalides;Estensioni non valide;Ungültige Erweiterungen;Extensões inválidas;無効な拡張子;잘못된 확장자;无效扩展;無效的擴充功能
Invalid or incomplete code;Código inválido o incompleto;Code invalide ou incomplet;Codice non valido o incompleto;Ungültiger oder unvollständiger Code;Código inválido ou incompleto;無効または不完全なコード;잘못되었거나 불완전한 코드;无效或不完整代码;無效或不完整的程式碼
Error details;Detalles del error;Détails de l'erreur;Dettagli errore;Fehlerdetails;Detalhes do erro;エラー詳細;오류 세부정보;错误详情;錯誤詳情
Installed;Instalado;Installé;Installato;Installiert;Instalado;インストール済み;설치됨;已安装;已安裝
Trending Right Now;Tendencias ahora;Tendance actuelle;Tendenze attuali;Derzeit angesagt;Tendências atuais;今話題;현재 인기;当前热门;目前熱門
in;en;dans;in;in;em;で;에;在;於
days;días;jours;giorni;Tage;dias;日;일;天;天
years;años;années;anni;Jahre;anos;年;년;年;年
months;meses;mois;mesi;Monate;meses;月;개월;月;月
weeks;semanas;semaines;settimane;Wochen;semanas;週;주;周;週
day;día;jour;giorno;Tag;dia;日;일;天;天
week;semana;semaine;settimana;Woche;semana;週;주;周;週
month;mes;mois;mese;Monat;mês;月;개월;月;月
year;año;année;anno;Jahr;ano;年;년;年;年
Open on AniDB;Abrir en AniDB;Ouvrir sur AniDB;Apri su AniDB;Auf AniDB öffnen;Abrir no AniDB;AniDBで開く;AniDB에서 열기;在AniDB打开;在 AniDB 開啟
Most popular of;Más popular de;Le plus populaire de;Il più popolare di;Am beliebtesten von;Mais popular de;で最も人気;에서 가장 인기;最受欢迎的;最受歡迎於
Highest rated of;Mejor valorado de;Le mieux noté de;Più votato di;Am höchsten bewertet von;Mais bem avaliado de;で最も評価が高い;에서 평점 최고;评分最高;最高評分於
Highest rated of all time;Mejor valorado de todos los tiempos;Le mieux noté de tous les temps;Più votato di tutti i tempi;Am höchsten bewertet aller Zeiten;Mais bem avaliado de todos os tempos;史上最高評価;역대 최고 평점;史上最高评分;歷史最高評分
Most popular of;Más popular de;Le plus populaire de;Il più popolare di;Am beliebtesten von;Mais popular de;で最も人気;에서 가장 인기;最受欢迎的;最受歡迎於
jan;ene;janv;gen;Jan;jan;1月;1월;1月;一月
feb;feb;févr;feb;Feb;fev;2月;2월;2月;二月
mar;mar;mars;mar;Mär;mar;3月;3월;3月;三月
apr;abr;avr;apr;Apr;abr;4月;4월;4月;四月
may;may;mai;mag;Mai;mai;5月;5월;5月;五月
jun;jun;juin;giu;Jun;jun;6月;6월;6月;六月
jul;jul;juil;lug;Jul;jul;7月;7월;7月;七月
aug;ago;août;ago;Aug;ago;8月;8월;8月;八月
oct;oct;oct;ott;Okt;out;10月;10월;10月;十月
nov;nov;nov;nov;Nov;nov;11月;11월;11月;十一月
dec;dic;déc;dic;Dez;dez;12月;12월;12月;十二月
Aired on;Emitido el;Diffusé le;Trasmesse il;Ausgestrahlt am;Transmitido em;放送日;방송일;播出日期;播出於
switch to sub;Cambiar a subtítulos;Passer aux sous-titres;Passa ai sottotitoli;Auf Untertitel wechseln;Mudar para legendas;字幕に切り替え;자막으로 전환;切换到字幕;切換至字幕
cache;Caché;Cache;Cache;Cache;Cache;キャッシュ;캐시;缓存;快取
Open online Streaming;Abrir streaming online;Ouvrir le streaming en ligne;Apri streaming online;Online-Streaming öffnen;Abrir streaming online;オンラインストリーミングを開く;온라인 스트리밍 열기;打开在线视频;開啟線上串流
Close online streaming;Cerrar streaming online;Fermer le streaming en ligne;Chiudi streaming online;Online-Streaming schließen;Fechar streaming online;オンラインストリーミングを閉じる;온라인 스트리밍 닫기;关闭在线视频;關閉線上串流
years old;años;ans;anni;Jahre;anos;歳;세;岁;歲
Establishing Connection;Estableciendo conexión;Établissement de la connexion;Connessione in corso;Verbindung wird hergestellt;Estabelecendo conexão;接続中;연결 중;正在建立连接;正在建立連線
Launching;Iniciando;Lancement;Avvio;Starten;Iniciando;起動中;실행 중;启动中;啟動中
Apply;Aplicar;Appliquer;Applica;Anwenden;Aplicar;適用;적용;应用;套用
To Language;A idioma;Vers la langue;Alla lingua;Zur Sprache;Para idioma;言語に変更;언어로 변경;切换语言;目標語言
Enable watch history;Activar historial de visionado;Activer l'historique de visionnage;Abilita cronologia visione;Sehen-Verlauf aktivieren;Ativar histórico de visualização;視聴履歴を有効にする;시청 기록 활성화;启用观看历史;啟用觀看歷史
If enabled, Seanime will remember your watch progress and resume from where you left off.;Si está activado, Seanime recordará tu progreso y continuará donde lo dejaste.;Si activé, Seanime se souviendra de votre progression et reprendra là où vous vous êtes arrêté.;Se abilitato, Seanime ricorderà i tuoi progressi e riprenderà da dove avevi interrotto.;Wenn aktiviert, merkt sich Seanime deinen Fortschritt und setzt dort fort, wo du aufgehört hast.;Se ativado, Seanime lembrará seu progresso e continuará de onde você parou.;有効にすると、Seanimeは視聴進捗を記憶し、中断した場所から再開します;활성화하면 Seanime가 시청 진행 상황을 기억하고 중단한 곳부터 이어서 재생;启用后，Seanime会记住你的观看进度，并从上次停止处继续;啟用後，Seanime 會記住你的觀看進度，並從上次中斷處繼續播放。
Highest rated Movie of All Time;Película mejor valorada de todos los tiempos;Film le mieux noté de tous les temps;Film più votato di tutti i tempi;Am höchstbewerteten Film aller Zeiten;Filme mais bem avaliados de todos os tempos;史上最高評価の映画;역대 최고 평점 영화;史上最高评分电影;歷史最高評分電影
Highes Rated Movie of;Película mejor valorada de;Film le mieux noté de;Film più votato di;Am höchstbewerteten Film von;Filme mais bem avaliados de;で最も評価が高い映画;에서 평점 최고 영화;评分最高电影;該期間最高評分電影
Most Popular Movie of;Película más popular de;Film le plus populaire de;Film più popolare di;Am beliebtesten Film von;Filme mais populares de;で最も人気の映画;에서 가장 인기 영화;最受欢迎电影;該期間最受歡迎電影
Loading;Cargando;Chargement;Caricamento;Wird geladen;Carregando;読み込み中;로딩 중;加载中;載入中
Trending;Tendencias;Tendances;Di tendenza;Im Trend;Em alta;注目;인기;热门;熱門
shows;Series;Séries;Serie;Serien;Séries;番組;쇼;剧集;節目
movies;Películas;Films;Film;Filme;Filmes;映画;영화;电影;電影
Anime library;Biblioteca de anime;Bibliothèque anime;Libreria anime;Anime-Bibliothek;Biblioteca de anime;アニメライブラリ;애니메이션 라이브러리;动漫库;動畫庫
Upload local lists to AniList;Subir listas locales a AniList;Téléverser les listes locales sur AniList;Carica liste locali su AniList;Lokale Listen zu AniList hochladen;Enviar listas locais para AniList;ローカルリストをAniListにアップロード;로컬 리스트를 AniList에 업로드;上传本地列表到AniList;上傳本地清單至 AniList
Refresh sources;Actualizar fuentes;Actualiser les sources;Aggiorna fonti;Quellen aktualisieren;Atualizar fontes;ソースを更新;소스 새로고침;刷新来源;重新整理來源
Reading;Leyendo;Lecture;Lettura;Lesen;Lendo;読書中;읽는 중;阅读中;閱讀中
Read;Leer;Lire;Leggere;Lesen;Ler;読む;읽기;阅读;已讀
Translates Seanime UI into 9 different languages.;Traduce la interfaz de Seanime a 9 idiomas diferentes.;Traduit l'interface de Seanime en 9 langues différentes.;Traduce l'interfaccia di Seanime in 9 lingue diverse.;Übersetzt die Seanime-Oberfläche in 9 verschiedene Sprachen.;Traduz a interface do Seanime para 9 idiomas diferentes.;SeanimeのUIを9つの言語に翻訳します。;Seanime UI를 9가지 언어로 번역합니다.;将Seanime界面翻译成9种语言。;將 Seanime 介面翻譯成 9 種不同語言。
Airing schedule;Calendario de emisión;Calendrier de diffusion;Programma di messa in onda;Sendeplan;Cronograma de exibição;放送スケジュール;방송 일정;放送时间表;播出時間表
Open page;Abrir página;Ouvrir la page;Apri pagina;Seite öffnen;Abrir página;ページを開く;페이지 열기;打开页面;開啟頁面
airing at;emitiéndose a;diffusé à;in onda alle;wird ausgestrahlt um;exibindo às;放送時間;방송 시간;播出于;播出於
Add extensions;Añadir extensiones;Ajouter des extensions;Aggiungi estensioni;Erweiterungen hinzufügen;Adicionar extensões;拡張機能を追加;확장 기능 추가;添加扩展功能;新增擴充功能
Browse all media;Explorar todos los medios;Parcourir tous les médias;Sfoglia tutti i media;Alle Medien durchsuchen;Navegar por todos os media;すべてのメディアを閲覧;모든 미디어 탐색;浏览所有媒体;瀏覽所有媒體
Reload;Recargar;Recharger;Ricarica;Neu laden;Recarregar;再読み込み;새로 고침;重新加载;重新載入
Change repository;Cambiar repositorio;Changer de dépôt;Cambia repository;Repository ändern;Alterar repositório;リポジトリを変更;저장소 변경;更改存储库;更改儲存庫
Enter marketplace URL;Introducir URL del mercado;Entrer l’URL du marché;Inserisci l’URL del marketplace;Marketplace-URL eingeben;Inserir URL do marketplace;マーケットプレイスURLを入力;마켓플레이스 URL 입력;输入市场网址;輸入市集網址
Advanced search;Búsqueda avanzada;Recherche avancée;Ricerca avanzata;Erweiterte Suche;Pesquisa avançada;詳細検索;고급 검색;高级搜索;進階搜尋
Search...;Buscar...;Chercher...;Cerca...;Suchen...;Pesquisar...;検索...;검색...;搜索...;搜尋...
Custom Sources;Fuentes personalizadas;Sources personnalisées;Fonti personalizzate;Benutzerdefinierte Quellen;Fontes personalizadas;カスタムソース;사용자 정의 소스;自定义来源;自訂來源
Prequel;Precuela;Préquelle;Prequel;Prequel;Prequela;前日譚;프리퀄;前传;前傳
Sequel;Secuela;Suite;Sequel;Fortsetzung;Sequência;続編;시퀄;续集;續集
Not in your library;No está en tu biblioteca;Pas dans votre bibliothèque;Non è nella tua libreria;Nicht in deiner Bibliothek;Não está na sua biblioteca;ライブラリにありません;내 라이브러리에 없음;不在你的资料库中;不在你的資料庫中
No summary;Sin resumen;Pas de résumé;Nessun riassunto;Keine Zusammenfassung;Sem resumo;概要なし;요약 없음;无摘要;無摘要
Entry updated;Entrada actualizada;Entrée mise à jour;Voce aggiornata;Eintrag aktualisiert;Entrada atualizada;項目が更新されました;항목이 업데이트됨;条目已更新;條目已更新
Entry deleted;Entrada eliminada;Entrée supprimée;Voce eliminata;Eintrag gelöscht;Entrada excluída;項目が削除されました;항목이 삭제됨;条目已删除;條目已刪除
If enabled, the file path will be base64 encoded in the URL to avoid issues with special characters.;Si se habilita, la ruta del archivo se codificará en base64 en la URL para evitar problemas con caracteres especiales.;Si activé, le chemin du fichier sera encodé en base64 dans l’URL pour éviter les problèmes avec les caractères spéciaux.;Se abilitato, il percorso del file verrà codificato in base64 nell’URL per evitare problemi con caratteri speciali.;Wenn aktiviert, wird der Dateipfad in der URL base64-codiert, um Probleme mit Sonderzeichen zu vermeiden.;Se ativado, o caminho do arquivo será codificado em base64 na URL para evitar problemas com caracteres especiais.;有効にすると、ファイルパスは特殊文字の問題を回避するためにURL内でbase64エンコードされます。;활성화하면 특수 문자 문제를 방지하기 위해 파일 경로가 URL에서 base64로 인코딩됩니다.;启用后，文件路径将在 URL 中以 base64 编码，以避免特殊字符问题。;啟用後，檔案路徑將在 URL 中以 base64 編碼，以避免特殊字元問題。
Encode file path in URL (library only);Codificar ruta de archivo en URL (solo biblioteca);Encoder le chemin du fichier dans l’URL (bibliothèque uniquement);Codifica il percorso del file nell’URL (solo libreria);Dateipfad in URL codieren (nur Bibliothek);Codificar caminho do arquivo na URL (somente biblioteca);URL内でファイルパスをエンコード（ライブラリのみ）;URL에서 파일 경로 인코딩 (라이브러리 전용);在 URL 中编码文件路径（仅限资料库）;在 URL 中編碼檔案路徑（僅限資料庫）
Used for auto-selecting torents when streaming. Select 'None' if you don't need torrent support.;Se usa para seleccionar torrents automáticamente al transmitir. Selecciona “Ninguno” si no necesitas soporte para torrents.;Utilisé pour la sélection automatique des torrents lors du streaming. Sélectionnez « Aucun » si vous n’avez pas besoin de support torrent.;Usato per selezionare automaticamente i torrent durante lo streaming. Seleziona "Nessuno" se non ti serve il supporto torrent.;Wird zum automatischen Auswählen von Torrents beim Streaming verwendet. Wähle „Keine“, wenn du keine Torrent-Unterstützung benötigst.;Usado para selecionar automaticamente torrents ao transmitir. Escolha “Nenhum” se não precisar de suporte a torrent.;ストリーミング時にトレントを自動選択するために使用されます。トレントサポートが不要な場合は「なし」を選択してください。;스트리밍 시 토렌트를 자동 선택하는 데 사용됩니다. 토렌트 지원이 필요하지 않으면 ‘없음’을 선택하세요.;用于串流时自动选择种子。如不需要种子支持，请选择“无”。;用於串流時自動選擇種子。如不需要種子支援，請選擇「無」。
Enabling host mode does not automatically set up remote access; you must manually expose your server using your preferred method.;Habilitar el modo host no configura automáticamente el acceso remoto; debes exponer manualmente tu servidor usando tu método preferido.;L’activation du mode hôte ne configure pas automatiquement l’accès à distance ; vous devez exposer manuellement votre serveur selon la méthode de votre choix.;L’abilitazione della modalità host non configura automaticamente l’accesso remoto; devi esporre manualmente il server con il metodo che preferisci.;Das Aktivieren des Hostmodus richtet keinen Remotezugriff automatisch ein; du musst den Server manuell über deine bevorzugte Methode freigeben.;Ativar o modo host não configura automaticamente o acesso remoto; você deve expor manualmente seu servidor usando o método preferido.;ホストモードを有効にしてもリモートアクセスは自動的に設定されません。希望する方法で手動でサーバーを公開する必要があります。;호스트 모드를 활성화해도 원격 액세스가 자동으로 설정되지 않습니다. 원하는 방식으로 서버를 수동으로 노출해야 합니다.;启用主机模式不会自动设置远程访问；你必须使用首选方法手动公开服务器。;啟用主機模式不會自動設定遠端存取；你必須使用偏好的方法手動公開伺服器。
Show total size;Mostrar tamaño total;Afficher la taille totale;Mostra dimensione totale;Gesamtgröße anzeigen;Mostrar tamanho total;合計サイズを表示;총 크기 표시;显示总大小;顯示總大小
Upcoming episodes;Próximos episodios;Épisodes à venir;Episodi in arrivo;Bevorstehende Episoden;Próximos episódios;今後のエピソード;다가오는 에피소드;即将播出的剧集;即將播出的劇集
My lists;Mis listas;Mes listes;Le mie liste;Meine Listen;Minhas listas;マイリスト;내 목록;我的列表;我的清單
Watching;Viendo;En cours de visionnage;Guardando;Am Anschauen;Assistindo;視聴中;시청 중;正在观看;正在觀看
Your home screen is empty;Tu pantalla de inicio está vacía;Votre écran d’accueil est vide;La tua schermata iniziale è vuota;Dein Startbildschirm ist leer;Sua tela inicial está vazia;ホーム画面が空です;홈 화면이 비어 있습니다;你的主屏幕是空的;你的主畫面是空的
No series are currently being watched;No se está viendo ninguna serie;Aucune série n’est actuellement regardée;Nessuna serie è attualmente in visione;Derzeit wird keine Serie angesehen;Nenhuma série está sendo assistida atualmente;現在視聴中のシリーズはありません;현재 시청 중인 시리즈가 없습니다;当前没有正在观看的剧集;目前沒有正在觀看的劇集
Add series to your 'Currently watching' list to get started;Añade series a tu lista de “Viendo actualmente” para comenzar;Ajoutez des séries à votre liste « En cours de visionnage » pour commencer;Aggiungi serie alla tua lista “Attualmente guardando” per iniziare;Aktualisiere deine Liste „Derzeit ansehen“, um zu starten;Adicione séries à sua lista “Assistindo atualmente” para começar;「視聴中」リストにシリーズを追加して開始します;‘현재 시청 중’ 목록에 시리즈를 추가하여 시작하세요;将剧集添加到“正在观看”列表以开始;將影集加入「正在觀看」清單以開始
Home settings;Configuración de inicio;Paramètres d’accueil;Impostazioni della home;Startbildschirm-Einstellungen;Configurações da tela inicial;ホーム設定;홈 설정;主页设置;主頁設定
All anime in your currently watching list will be included in the library;Todo el anime de tu lista de “Viendo actualmente” se incluirá en la biblioteca;Tous les animés de votre liste « En cours de visionnage » seront inclus dans la bibliothèque;Tutti gli anime nella tua lista “Attualmente guardando” saranno inclusi nella libreria;Alle Anime in deiner „Derzeit ansehen“-Liste werden in die Bibliothek aufgenommen;Todos os animes da sua lista “Assistindo atualmente” serão incluídos na biblioteca;「視聴中」リスト内のすべてのアニメがライブラリに含まれます;‘현재 시청 중’ 목록의 모든 애니메이션이 라이브러리에 포함됩니다;“正在观看”列表中的所有动画将包含在资料库中;「正在觀看」清單中的所有動畫都會包含在資料庫中
Available Items;Elementos disponibles;Éléments disponibles;Elementi disponibili;Verfügbare Elemente;Itens disponíveis;利用可能なアイテム;사용 가능한 항목;可用项目;可用項目
Aired Recently (Global);Emitido recientemente (Global);Diffusé récemment (Global);Andato in onda di recente (Globale);Kürzlich ausgestrahlt (Global);Transmitido recentemente (Global);最近放送された（グローバル）;최근 방송됨 (글로벌);最近播放（全球）;最近播放（全球）
Anime Carousel;Carrusel de anime;Carrousel d’anime;Carosello di anime;Anime-Karussell;Carrossel de anime;アニメリール;애니메이션 캐러셀;动画轮播;動畫輪播
Display a carousel of anime episodes that aired recently.;Muestra un carrusel de episodios de anime emitidos recientemente.;Affiche un carrousel d’épisodes d’anime diffusés récemment.;Mostra un carosello di episodi di anime andati in onda di recente.;Zeigt ein Karussell kürzlich ausgestrahlter Anime-Episoden an.;Exibe um carrossel de episódios de anime transmitidos recentemente.;最近放送されたアニメエピソードのカルーセルを表示します。;최근 방송된 애니메이션 에피소드 캐러셀을 표시합니다.;显示最近播放的动画剧集轮播。;顯示最近播放的動畫集輪播。
Display a carousel of anime based on the selected options.;Muestra un carrusel de anime según las opciones seleccionadas.;Affiche un carrousel d’anime selon les options sélectionnées.;Mostra un carosello di anime in base alle opzioni selezionate.;Zeigt ein Karussell von Anime basierend auf den ausgewählten Optionen an.;Exibe um carrossel de animes com base nas opções selecionadas.;選択したオプションに基づいたアニメのカルーセルを表示します。;선택한 옵션에 따라 애니메이션 캐러셀을 표시합니다.;根据所选选项显示动画轮播。;根據所選選項顯示動畫輪播。
Anime Schedule Calendar;Calendario de emisiones de anime;Calendrier de diffusion d’anime;Calendario delle programmazioni anime;Anime-Sendeplan-Kalender;Calendário de programação de anime;アニメ放送スケジュールカレンダー;애니메이션 방송 일정 달력;动画播出日历;動畫播放行事曆
Display a calendar of anime episodes based on their airing schedule.;Muestra un calendario de episodios de anime según su programación de emisión.;Affiche un calendrier des épisodes d’anime selon leur calendrier de diffusion.;Mostra un calendario degli episodi di anime in base al loro programma di trasmissione.;Zeigt einen Kalender mit Anime-Episoden basierend auf deren Ausstrahlungsplan.;Exibe um calendário de episódios de anime de acordo com a programação.;放送スケジュールに基づいてアニメエピソードのカレンダーを表示します。;방송 일정에 따라 애니메이션 에피소드 달력을 표시합니다.;根据播放时间表显示动画剧集日历。;根據播放時程顯示動畫集日曆。
Centered title;Título centrado;Titre centré;Titolo centrato;Zentrierter Titel;Título centralizado;中央揃えのタイトル;가운데 정렬된 제목;居中标题;置中標題
Display a centered title text.;Muestra un texto de título centrado.;Affiche un texte de titre centré.;Mostra un testo del titolo centrato.;Zeigt einen zentrierten Titeltext an.;Exibe um texto de título centralizado.;中央揃えのタイトルテキストを表示します。;가운데 정렬된 제목 텍스트를 표시합니다.;显示居中的标题文字。;顯示置中的標題文字。
Continue Watching;Seguir viendo;Continuer à regarder;Continua a guardare;Weiterschauen;Continuar assistindo;視聴を続ける;이어보기;继续观看;繼續觀看
Display a list of episodes you are currently watching.;Muestra una lista de episodios que estás viendo actualmente.;Affiche une liste des épisodes que vous regardez actuellement.;Mostra un elenco di episodi che stai attualmente guardando.;Zeigt eine Liste der Episoden, die du derzeit ansiehst.;Exibe uma lista de episódios que você está assistindo atualmente.;現在視聴中のエピソードのリストを表示します。;현재 시청 중인 에피소드 목록을 표시합니다.;显示你当前正在观看的剧集列表。;顯示你目前正在觀看的劇集列表。
Continue Watching Header;Encabezado de “Seguir viendo”;En-tête « Continuer à regarder »;Intestazione “Continua a guardare”;Überschrift „Weiterschauen“;Cabeçalho “Continuar assistindo”;「視聴を続ける」ヘッダー;‘이어보기’ 헤더;“继续观看”标题栏;「繼續觀看」標題列
Display a header with a carousel of anime you are currently watching.;Muestra un encabezado con un carrusel de los animes que estás viendo actualmente.;Affiche un en-tête avec un carrousel des animés que vous regardez actuellement.;Mostra un’intestazione con un carosello degli anime che stai attualmente guardando.;Zeigt eine Kopfzeile mit einem Karussell der Anime, die du derzeit siehst.;Exibe um cabeçalho com um carrossel dos animes que você está assistindo atualmente.;現在視聴中のアニメのカルーセルを含むヘッダーを表示します。;현재 시청 중인 애니메이션 캐러셀과 함께 헤더를 표시합니다.;显示包含你当前正在观看动画的轮播标题。;顯示包含你目前正在觀看動畫的輪播標題。
Discover Header;Encabezado de descubrimiento;En-tête Découverte;Intestazione Scoperta;Entdecker-Kopfzeile;Cabeçalho Descobrir;ディスカバーヘッダー;디스커버 헤더;发现标题栏;探索標題列
Display a header with a carousel of anime that are trending.;Muestra un encabezado con un carrusel de animes que están en tendencia.;Affiche un en-tête avec un carrousel d’anime populaires.;Mostra un’intestazione con un carosello di anime di tendenza.;Zeigt eine Kopfzeile mit einem Karussell angesagter Anime an.;Exibe um cabeçalho com um carrossel de animes em alta.;トレンドのアニメのカルーセルを含むヘッダーを表示します。;트렌드 애니메이션 캐러셀과 함께 헤더를 표시합니다.;显示包含热门动画轮播的标题栏。;顯示包含熱門動畫輪播的標題列。
Local Anime Library;Biblioteca de anime local;Bibliothèque d’anime locale;Libreria anime locale;Lokale Anime-Bibliothek;Biblioteca local de anime;ローカルアニメリスト;로컬 애니메이션 라이브러리;本地动画资料库;本地動畫資料庫
Display a complete grid of anime you have in your local library.;Muestra una cuadrícula completa de los animes que tienes en tu biblioteca local.;Affiche une grille complète des animes que vous avez dans votre bibliothèque locale.;Mostra una griglia completa degli anime presenti nella tua libreria locale.;Zeigt ein vollständiges Raster der Anime in deiner lokalen Bibliothek.;Exibe uma grade completa dos animes na sua biblioteca local.;ローカルライブラリ内のアニメの完全なグリッドを表示します。;로컬 라이브러리에 있는 애니메이션의 전체 그리드를 표시합니다.;显示你本地资料库中的完整动画网格。;顯示本地資料庫中完整的動畫網格。
Manga Carousel;Carrusel de manga;Carrousel de manga;Carosello di manga;Manga-Karussell;Carrossel de mangá;マンガカルーセル;만화 캐러셀;漫画轮播;漫畫輪播
Display a carousel of manga based on the selected options.;Muestra un carrusel de manga según las opciones seleccionadas.;Affiche un carrousel de mangas selon les options sélectionnées.;Mostra un carosello di manga in base alle opzioni selezionate.;Zeigt ein Karussell von Manga basierend auf den ausgewählten Optionen an.;Exibe um carrossel de mangás com base nas opções selecionadas.;選択したオプションに基づいたマンガのカルーセルを表示します。;선택한 옵션에 따라 만화 캐러셀을 표시합니다.;根据所选选项显示漫画轮播。;根據所選選項顯示漫畫輪播。
Manga Library;Biblioteca de manga;Bibliothèque de manga;Libreria manga;Manga-Bibliothek;Biblioteca de mangá;マンガライブラリ;만화 라이브러리;漫画资料库;漫畫資料庫
Display a list of manga you have in your library by status.;Muestra una lista de mangas que tienes en tu biblioteca según su estado.;Affiche une liste des mangas de votre bibliothèque par statut.;Mostra un elenco di manga presenti nella tua libreria per stato.;Zeigt eine Liste der Manga in deiner Bibliothek nach Status an.;Exibe uma lista dos mangás na sua biblioteca por status.;ライブラリ内のマンガをステータス別に表示します。;라이브러리의 만화를 상태별로 표시합니다.;按状态显示资料库中的漫画列表。;依狀態顯示資料庫中的漫畫清單。
Upcoming Library Episodes;Próximos episodios de la biblioteca;Épisodes à venir de la bibliothèque;Episodi imminenti della libreria;Bevorstehende Episoden der Bibliothek;Próximos episódios da biblioteca;ライブラリの今後のエピソード;라이브러리의 다가오는 에피소드;资料库中的即将播出剧集;資料庫中即將播出的劇集
Display a carousel of upcoming episodes from anime you have in your library.;Muestra un carrusel de los próximos episodios de los animes en tu biblioteca.;Affiche un carrousel des prochains épisodes des animés de votre bibliothèque.;Mostra un carosello dei prossimi episodi degli anime presenti nella tua libreria.;Zeigt ein Karussell der bevorstehenden Episoden von Anime in deiner Bibliothek an.;Exibe um carrossel dos próximos episódios dos animes da sua biblioteca.;ライブラリ内のアニメの今後のエピソードのカルーセルを表示します。;라이브러리의 애니메이션 다가오는 에피소드 캐러셀을 표시합니다.;显示资料库中动画的即将播出剧集轮播。;顯示資料庫中動畫即將播出的劇集輪播。
Local Anime Library Stats;Estadísticas de la biblioteca local de anime;Statistiques de la bibliothèque d’anime locale;Statistiche della libreria anime locale;Statistiken der lokalen Anime-Bibliothek;Estatísticas da biblioteca local de anime;ローカルアニメライブラリの統計;로컬 애니메이션 라이브러리 통계;本地动漫库统计;本地動畫庫統計
Display the stats for your local anime library.;Muestra las estadísticas de tu biblioteca local de anime.;Affiche les statistiques de votre bibliothèque d’anime locale.;Mostra le statistiche della tua libreria anime locale.;Zeigt die Statistiken deiner lokalen Anime-Bibliothek an.;Exibe as estatísticas da sua biblioteca local de anime.;ローカルアニメライブラリの統計を表示します。;로컬 애니메이션 라이브러리의 통계를 표시합니다.;显示本地动漫库的统计信息。;顯示本地動畫庫的統計資訊。
`;

        function parseTranslations(csv) {
            try {
                const lines = csv
                    .trim()
                    .split(/\r?\n/)
                    .filter(l => l.trim() && !l.trim().startsWith("#"));

                const delimiter = lines[0].includes(";") ? ";" : ",";

                function splitCSV(line) {
                    const result = [];
                    let current = "";
                    let insideQuotes = false;

                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') insideQuotes = !insideQuotes;
                        else if (char === delimiter && !insideQuotes) {
                            result.push(current.trim());
                            current = "";
                        } else current += char;
                    }
                    result.push(current.trim());
                    return result.map(c => c.replace(/^"|"$/g, ""));
                }

                const headers = splitCSV(lines[0]);
                const langs = headers.slice(1);
                const data = { en: {} };
                for (const lang of langs) data[lang] = {};

                for (const line of lines.slice(1)) {
                    const cols = splitCSV(line);
                    if (!cols.length) continue;
                    const key = cols[0].trim();
                    if (!key) continue;
                    data.en[key] = key;
                    langs.forEach((lang, i) => {
                        const val = cols[i + 1]?.trim();
                        if (val) data[lang][key] = val;
                    });
                }
                return data;
            } catch (error) {
                console.error("❌ Error parsing translations:", error);
                return null;
            }
        }

        const translations = parseTranslations(TRANSLATION_CSV);

        const tray = ctx.newTray({
            tooltipText: "UI Translator",
            iconUrl: "https://raw.githubusercontent.com/jabifx/seanime-extensions/master/src/UI-Translation/icon.png",
            withContent: true,
        });

        const currentLangRef = ctx.fieldRef(lang);


        async function injectTranslator(toLang) {
            console.log(`💉 Inyecting translator for ${toLang}`);

            const existing = await ctx.dom.queryOne('script[data-ui-translator]');
            if (existing) {
                console.log("⚠️ Cleaning past translator...");
                try {
                    if (window.__uiTranslatorObserver && typeof window.__uiTranslatorObserver.disconnect === 'function') {
                        window.__uiTranslatorObserver.disconnect();
                        window.__uiTranslatorObserver = null;
                    }
                    window.__uiTranslatorActive = null;
                } catch(e) {
                    console.error("Error:", e);
                }
                await existing.remove();
            }

            const script = await ctx.dom.createElement("script");
            const scriptContent = `
                (function() {
                    try {                        
                        if (window.__uiTranslatorObserver && typeof window.__uiTranslatorObserver.disconnect === 'function') {
                            try { 
                                window.__uiTranslatorObserver.disconnect(); 
                            } catch(e) {}
                            window.__uiTranslatorObserver = null;
                        }

                        if (window.__uiTranslatorActive === "${toLang}") {
                            return;
                        }

                        window.__uiTranslatorActive = "${toLang}";

                        const translations = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(translations))}"));
                        const targetLang = "${toLang}";
                        const MAX_TEXT_LENGTH = 120;
                        const MAX_CACHE_SIZE = 1000;
                        
                        const normalizeCache = new Map();
                        const languageIndex = new Map();

                        for (const [lang, dict] of Object.entries(translations)) {
                            for (const [key, val] of Object.entries(dict)) {
                                const norm = val.toLowerCase().replace(/\\u00A0/g, " ").replace(/\\s+/g, " ").trim();
                                if (!languageIndex.has(norm)) {
                                    languageIndex.set(norm, []);
                                }
                                languageIndex.get(norm).push({ lang, key });
                            }
                        }

                        function normalizeText(s) {
                            if (normalizeCache.size > MAX_CACHE_SIZE) {
                                normalizeCache.clear();
                            }
                            if (normalizeCache.has(s)) return normalizeCache.get(s);
                            const normalized = s.toLowerCase()
                                .replace(/\\u00A0/g, " ")
                                .replace(/\\s+/g, " ")
                                .trim();
                            normalizeCache.set(s, normalized);
                            return normalized;
                        }

                        function detectLanguage(text) {
                            const norm = normalizeText(text);
                            const matches = languageIndex.get(norm);
                            return matches?.[0]?.lang || null;
                        }

                        function translateNode(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && node.matches('a.cursor-pointer, a.cursor-pointer *')) {
                                    return;
                                }
                            }
                            if (node.nodeType === Node.TEXT_NODE) {
                                const text = node.textContent;
                                if (!text) return;
                                const normalized = normalizeText(text);
                                if (!normalized || normalized.length > MAX_TEXT_LENGTH) return;

                                const fromLang = detectLanguage(normalized);
                                if (fromLang && translations[targetLang]) {
                                    const keys = Object.keys(translations[fromLang]).sort((a, b) => b.length - a.length);
                                    for (const key of keys) {
                                        if (!translations[fromLang] || !translations[fromLang][key]) continue;
                                        if (normalizeText(translations[fromLang][key]) === normalized) {
                                            let newText = (translations[targetLang] && translations[targetLang][key]) ? translations[targetLang][key] : translations[fromLang][key];
                                    
                                            // Comprobar "Episode" (clave o texto) y envolver con espacios si aplica
                                            const keyIsEpisode = String(key).trim().toLowerCase() === "episode";
                                            const srcIsEpisode = normalizeText(translations[fromLang][key]) === "episode";
                                            const tgtIsEpisode = normalizeText(newText) === "episode";
                                            if (keyIsEpisode || srcIsEpisode || tgtIsEpisode) {
                                                newText = " " + newText + " ";
                                            }
                                            node.textContent = newText;

                                            if ((keyIsEpisode || srcIsEpisode || tgtIsEpisode) && node.nextSibling) {
                                                const next = node.nextSibling;
                                                if (next.nodeType === Node.TEXT_NODE && next.textContent.trim() === "s") {
                                                    next.textContent = "";
                                                }
                                            }
                                            
                                            break;
                                        }
                                    }
                                }
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                ["placeholder", "title", "alt", "aria-label", "value"].forEach(attr => {
                                    const val = node.getAttribute(attr);
                                    if (val) {
                                        const normVal = normalizeText(val);
                                        if (normVal.length > MAX_TEXT_LENGTH) return;
                                        const fromLang = detectLanguage(normVal);
                                        if (fromLang && translations[targetLang]) {
                                            const keys = Object.keys(translations[fromLang]).sort((a, b) => b.length - a.length);
                                            for (const key of keys) {
                                                if (normalizeText(translations[fromLang][key]) === normVal) {
                                                    const newVal = translations[targetLang][key];
                                                    if (newVal) {
                                                        node.setAttribute(attr, newVal);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });

                                for (let child of node.childNodes) translateNode(child);
                                if (node.shadowRoot) translateNode(node.shadowRoot);
                            }
                        }

                        translateNode(document.body);

                        const observer = new MutationObserver((mutations) => {
                            for (const m of mutations) {
                                for (const n of m.addedNodes) translateNode(n);
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
                        window.__uiTranslatorObserver = observer;

                        function _cleanup() {
                            try {
                                if (window.__uiTranslatorObserver && typeof window.__uiTranslatorObserver.disconnect === 'function') {
                                    window.__uiTranslatorObserver.disconnect();
                                    window.__uiTranslatorObserver = null;
                                }
                            } catch(e){}
                            window.__uiTranslatorActive = null;
                        }
                        window.addEventListener("beforeunload", _cleanup);
                        window.addEventListener("pagehide", _cleanup);


                    } catch (err) {
                        console.error("Error:", err);
                    }
                })();
            `;

            await script.setAttribute("type", "text/javascript");
            await script.setAttribute("data-ui-translator", "true");
            await script.setText(scriptContent);

            const body = await ctx.dom.queryOne("body");
            if (body) {
                await body.append(script);
            }
        }

        ctx.registerEventHandler("apply-language", async () => {
            const lang = currentLangRef.current;
            $storage.set("language", lang);
            await injectTranslator(lang);
        });

        tray.render(() =>
            tray.stack({
                items: [
                    tray.text("🌐 Translate UI"),
                    tray.select("Idioma", {
                        placeholder: "Choose...",
                        options: [
                            { label: "English", value: "en" },
                            { label: "Español", value: "es" },
                            { label: "Français", value: "fr" },
                            { label: "Italiano", value: "it" },
                            { label: "Deutsch", value: "de" },
                            { label: "Português", value: "pt" },
                            { label: "日本語", value: "ja" },
                            { label: "한국어", value: "ko" },
                            { label: "简体中文", value: "zh-CN" },
                            { label: "繁體中文", value: "zh-TW" }
                        ],
                        fieldRef: currentLangRef,
                    }),
                    tray.button("Apply", { onClick: "apply-language", intent: "success" }),
                ],
            })
        );

        ctx.dom.onReady(async () => {
            const lang = currentLangRef.current;
            if (lang && lang !== "en") {
                await injectTranslator(lang);
            }
        });
    });
}