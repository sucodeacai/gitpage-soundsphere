class DAOHome extends DAO{
    soundSphereDBToJson (listItemBuffer:ItemBuffer[],listItemMixPanel:ItemMixPanel[][],listSemanticDescriptor:SemanticDescriptor[]) {
        return new SoundSphereBD(listItemBuffer ,listItemMixPanel, this.listSemanticDescriptors, this.soundSphereInfo);
    };
}



