"use strict";
class DAOHome extends DAO {
    soundSphereDBToJson(listItemBuffer, listItemMixPanel, listSemanticDescriptor) {
        return new SoundSphereBD(listItemBuffer, listItemMixPanel, this.listSemanticDescriptors, this.soundSphereInfo);
    }
    ;
}
