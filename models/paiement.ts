import mongoose from 'mongoose';

const echeanceSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  montant: { type: Number, required: true },
  dateEcheance: { type: Date, required: true },
  statut: { 
    type: String, 
    enum: ['en_attente', 'paye', 'en_retard'],
    default: 'en_attente'
  },
  montantPaye: { type: Number, default: 0 },
  datePaiement: { type: Date }
});

const paiementSchema = new mongoose.Schema({
  commandeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Commande',
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true 
  },
  montantInitial: { type: Number, required: true },
  montantPaye: { type: Number, required: true },
  resteAPayer: { type: Number, required: true },
  datePaiement: { type: Date, required: true },
  statut: { 
    type: String, 
    enum: ['acompte', 'en_cours', 'termine'],
    required: true 
  },
  type: { 
    type: String, 
    enum: ['unique', 'echelonne'],
    required: true 
  },
  echeances: [echeanceSchema],
  historiquePaiements: [{
    montant: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { 
      type: String, 
      enum: ['acompte', 'mensualite'],
      required: true 
    },
    numeroEcheance: { type: Number }
  }]
}, {
  timestamps: true
});

export const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', paiementSchema); 