import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Cementerio')
export class Cementerio {
    @PrimaryGeneratedColumn('uuid')
    id_cementerio: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    direccion: string;

    @Column({ type: 'varchar', length: 100 })
    telefono: string;

    @Column({ type: 'varchar', length: 100 })
    responsable: string;

    @Column({ type: 'varchar', length: 100 })
    estado: string;

    @Column({ type: 'varchar', length: 100 })
    fecha_creacion: string;

    @Column({ type: 'varchar', length: 100 })
    fecha_modificacion: string;

    beforeInsert() {
        this.fecha_creacion = new Date().toISOString();
    }
    beforeUpdate() {
        this.fecha_modificacion = new Date().toISOString();
    }
    
}
